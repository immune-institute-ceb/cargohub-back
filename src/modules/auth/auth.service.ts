// Objective: Implement the service of the authentication module

// * NestJS modules
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// * Configs
import { envs } from '@config/envs';

// * External modules
import { google } from 'googleapis';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as requestIp from 'request-ip';

//* DTOs
import {
  SetPasswordDto,
  LoginUserDto,
  RecoverPasswordDto,
  RegisterUserAdminManagerDto,
  RegisterUserDto,
  TwoFactorDto,
  VerifyTwoFactorDto,
  ChangePasswordDto,
} from './dto';

//* Interfaces
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';
import {
  JwtPayload,
  JwtPayloadRecoverPassword,
  ValidRoles,
} from './interfaces';

//* Services
import { UsersService } from '@modules/users/users.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

//* Entities
import { User } from '@modules/users/entities/user.entity';

@Injectable()
class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly exceptionsService: ExceptionsService,
    private readonly auditLogsService: AuditLogsService,
  ) {
    // * Initialize the transporter
    const oauth2Client = new google.auth.OAuth2(
      envs.emailClientId,
      envs.emailClientSecret,
      envs.frontendUrl,
    );

    oauth2Client.setCredentials({
      refresh_token: envs.emailRefreshToken,
    });

    const accessToken = oauth2Client.getAccessToken();

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: envs.emailUser,
        clientId: envs.emailClientId,
        clientSecret: envs.emailClientSecret,
        refreshToken: envs.emailRefreshToken,
        accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const user = await this.usersService.create(registerUserDto);
      if (!user) throw new BadRequestException('User not created');
      await this.sendConfirmationEmail(user);
      return {
        message: 'User created, check your email to confirm your account',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async registerUserAdminManager(
    registerUserAdminManagerDto: RegisterUserAdminManagerDto,
  ) {
    try {
      const { __rolesValidator__, ...rest } =
        registerUserAdminManagerDto as any;
      const user = await this.usersService.create({
        ...rest,
      });
      if (!user) throw new BadRequestException('User not created');
      await this.sendConfirmationEmail(user);
      return {
        message: 'User created, check your email to confirm your account',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async sendConfirmationEmail(user: User) {
    try {
      await this.sendEmail(
        'Welcome to CargoHub',
        'confirm your Email',
        user.email,
        this.getJwtToken(
          {
            _id: user._id.toString(),
            message: 'confirmEmail',
          } as JwtPayloadRecoverPassword,
          '15m',
        ),
      );
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto, request: Request) {
    try {
      const { email, password } = loginUserDto;

      const user = (await this.usersService.findUserWithPassword(
        email,
      )) as User;

      if (!user) throw new UnauthorizedException(`Not valid credentials`);
      if (!user?.isActive || !user?.emailVerified)
        throw new UnauthorizedException('User is inactive, talk with an admin');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException(`Not valid credentials`);

      if (user.twoFactorAuthEnabled) {
        return {
          user: {
            email: user.email,
            twoFactorAuthEnabled: user.twoFactorAuthEnabled,
          },
          message: '2FA code is required',
        };
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        message: `User ${user.email} logged in`,
        context: AuditLogContext.authService,
        meta: {
          userId: user._id.toString(),
          ip: requestIp.getClientIp(request),
          userAgent: request.headers['user-agent'],
          timestamp: new Date().toISOString(),
        },
      });
      return this.loginWithToken(user);
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  loginWithToken(user: User) {
    const { password, permissions, emailVerified, ...userWithoutPassword } =
      user.toObject();
    return {
      userWithoutPassword,
      token: this.getJwtToken(
        {
          _id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.roles,
          permissions: user.permissions,
          message: 'login',
        } as JwtPayload,
        '2h',
      ),
    };
  }

  refreshToken(user: User) {
    return {
      token: this.getJwtToken(
        {
          _id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.roles,
          permissions: user.permissions,
          message: 'login',
        } as JwtPayload,
        '2h',
      ),
    };
  }

  async verifyToken(token: string) {
    try {
      const { _id } = await this.jwtService.verifyAsync<{
        _id: string;
      }>(token, {
        secret: envs.jwtSecret,
      });
      const user = await this.usersService.findUserById(_id);
      if (!user) throw new NotFoundException('User not found');
      return { message: 'Token is valid', role: user.roles };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async resetPassword(token: string, setPasswordDto: SetPasswordDto) {
    try {
      const { _id, message } = this.jwtService.verify<{
        _id: string;
        message: string;
      }>(token);
      const user = await this.usersService.findUserById(_id);
      if (!user) throw new NotFoundException('User not found');
      if (setPasswordDto.password !== setPasswordDto.passwordConfirmed)
        throw new BadRequestException('Passwords do not match');
      const passwordHash = bcrypt.hashSync(String(setPasswordDto.password), 10);

      if (message === 'confirmEmail') {
        if (user.emailVerified)
          throw new BadRequestException('Email already verified');
        user.emailVerified = true;
        user.password = passwordHash;
        await user.save();
        return await this.generate2faCode(user);
      }

      const userUpdated = await this.usersService.findAndUpdatePassword(
        _id,
        passwordHash,
      );

      if (!userUpdated) throw new NotFoundException('User not found');

      if (userUpdated.twoFactorAuthEnabled) {
        userUpdated.twoFactorAuthEnabled = false;
        return {
          message: 'Password updated, please verify your 2FA code',
          qrCode: userUpdated.twoFactorQrCode,
        };
      }
      return { message: 'Password updated' };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
    try {
      const { email } = recoverPasswordDto;

      const user = (await this.usersService.findUserByEmail(email)) as User;

      if (!user) throw new BadRequestException('Not valid credentials');

      await this.sendEmail(
        'CargoHub - Recover Password',
        'recover your Password',
        email,
        this.getJwtToken(
          {
            _id: user._id.toString(),
            message: 'recoverPassword',
          } as JwtPayloadRecoverPassword,
          '15m',
        ),
      );

      return { message: 'Email sent, check your inbox' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword, newPasswordConfirmed } =
        changePasswordDto;

      if (newPassword !== newPasswordConfirmed)
        throw new BadRequestException('Passwords do not match');

      const userWithPassword = await this.usersService.findUserWithPassword(
        user.email,
      );

      if (!userWithPassword) throw new NotFoundException('User not found');

      if (!bcrypt.compareSync(oldPassword, userWithPassword.password))
        throw new UnauthorizedException('Old password is incorrect');

      const passwordHash = bcrypt.hashSync(newPassword, 10);
      userWithPassword.password = passwordHash;
      await userWithPassword.save();

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async generate2faCode(user: User) {
    try {
      const userTo2fa = await this.usersService.findUserById(
        user._id.toString(),
      );

      if (!userTo2fa) throw new NotFoundException('User not found');
      if (userTo2fa.twoFactorAuth)
        throw new BadRequestException('2FA already enabled');

      const secret = speakeasy.generateSecret({
        name: `CargoHub - ${userTo2fa.email}`,
      });

      const otpauth_url = secret.otpauth_url;
      user.twoFactorAuth = secret.base32;
      await user.save();

      if (!otpauth_url) {
        throw new BadRequestException('Failed to generate OTP Auth URL');
      }

      const qrCode = await QRCode.toDataURL(otpauth_url);
      if (!qrCode) {
        throw new BadRequestException('Failed to generate QR code');
      }
      user.twoFactorQrCode = qrCode;
      await user.save();
      return {
        message: '2FA code generated',
        qrCode,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async activateTwoFactorCode(user: User, token: TwoFactorDto) {
    try {
      const userId = user._id.toString();
      const userTo2fa = await this.usersService.findUserById(userId);
      if (!userTo2fa || !userTo2fa.twoFactorAuth)
        throw new BadRequestException('2FA not enabled');

      if (userTo2fa.twoFactorAuthEnabled)
        throw new BadRequestException('2FA already enabled');

      const isValid = speakeasy.totp.verify({
        secret: userTo2fa.twoFactorAuth,
        encoding: 'base32',
        token: token.token,
      });

      if (!isValid) throw new BadRequestException('Invalid 2FA code');
      userTo2fa.twoFactorAuthEnabled = true;
      await userTo2fa.save();
      return { message: '2FA code activated' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async verify2faCode(verifiyTwoFactorDto: VerifyTwoFactorDto, req: Request) {
    try {
      const user = (await this.usersService.findUserByEmail(
        verifiyTwoFactorDto.email,
      )) as User;
      if (!user) throw new NotFoundException('User not found');
      if (!user.twoFactorAuth || !user.twoFactorAuthEnabled)
        throw new BadRequestException('2FA not enabled');

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorAuth,
        encoding: 'base32',
        token: verifiyTwoFactorDto.token,
      });

      if (!isValid) throw new BadRequestException('Invalid 2FA code');
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        message: `User ${user.email} logged in with 2FA`,
        context: AuditLogContext.authService,
        meta: {
          userId: user._id.toString(),
          ip: requestIp.getClientIp(req),
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString(),
        },
      });
      return { message: '2FA code verified', user: this.loginWithToken(user) };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async disableTwoFactor(user: User) {
    try {
      const userTo2fa = await this.usersService.findUserById(
        user._id.toString(),
      );
      if (!userTo2fa) throw new NotFoundException('User not found');
      if (!userTo2fa.twoFactorAuthEnabled)
        throw new BadRequestException('2FA not enabled');
      userTo2fa.twoFactorAuthEnabled = false;
      userTo2fa.twoFactorAuth = '';
      userTo2fa.twoFactorQrCode = '';
      await userTo2fa.save();
      return { message: '2FA code disabled' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  private getJwtToken(
    payload: JwtPayload | JwtPayloadRecoverPassword,
    expiresIn: string,
  ) {
    const token = this.jwtService.sign(payload, {
      expiresIn: expiresIn || '2h',
    });
    return token;
  }

  private async sendEmail(
    title: string,
    message: string,
    email: string,
    token: string,
  ) {
    try {
      const url = `${envs.frontendUrl}/set-password?_t=${token}`;
      await this.transporter.sendMail({
        from: envs.emailUser,
        to: email,
        subject: title,
        html: `<a href="${url}">Click here to ${message}</a>`,
      });
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}

export default AuthService;
