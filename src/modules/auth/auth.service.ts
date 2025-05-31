// Objective: Implement the service of the authentication module

// * NestJS modules
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// * External modules
import { google } from 'googleapis';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import * as requestIp from 'request-ip';

//* DTOs
import {
  ChangePasswordDto,
  ContactDto,
  LoginUserDto,
  RecoverPasswordDto,
  RegisterUserDto,
  TwoFactorDto,
  VerifyTwoFactorDto,
} from './dto';

//* Interfaces
import { JwtPayload, JwtPayloadRecoverPassword } from './interfaces';

//* Services
import { UsersService } from '@modules/users/users.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

//* Entities
import { User } from '@modules/users/entities/user.entity';
import { envs } from '@config/envs';
import { LogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { ContextLogs } from '@modules/audit-logs/interfaces/context-log.interface';
import { RegisterUserAdminManagerDto } from './dto/register-user-adminManager.dto';

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
      'http://localhost',
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

  private async sendConfirmationEmail(user: User) {
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
      if (user?.isDeleted) throw new UnauthorizedException('User is archived');
      if (!user?.isActive || !user?.emailVerified)
        throw new UnauthorizedException('User is inactive, talk with an admin');

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException(`Not valid credentials`);

      if (user.twoFactorAuthEnabled) {
        return {
          user: user.email,
          message: '2FA code is required',
        };
      }
      await this.auditLogsService.create({
        level: LogLevel.info,
        message: `User ${user.email} logged in`,
        context: ContextLogs.authService,
        meta: {
          userId: user._id.toString(),
          ip: requestIp.getClientIp(request),
          userAgent: request.headers['user-agent'],
          timestamp: new Date().toISOString(),
        },
      });
      return this.refreshToken(user);
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  refreshToken(user: User) {
    return {
      user,
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
        '1d',
      ),
    };
  }

  async verifyToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: envs.jwtSecret,
      });
      return { message: 'Token is valid' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async resetPassword(token: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { _id, message } = this.jwtService.verify<{
        _id: string;
        message: string;
      }>(token);
      const user = await this.usersService.findUserById(_id);
      if (!user) throw new NotFoundException('User not found');
      if (changePasswordDto.password !== changePasswordDto.passwordConfirmed)
        throw new BadRequestException('Passwords do not match');
      if (message === 'confirmEmail' && user.emailVerified)
        throw new BadRequestException('Email already confirmed');
      const passwordHash = bcrypt.hashSync(
        String(changePasswordDto.password),
        10,
      );

      const userUpdated = await this.usersService.findAndUpdatePassword(
        _id,
        passwordHash,
      );

      if (!userUpdated) throw new NotFoundException('User not found');

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

  async contact(body: ContactDto) {
    try {
      // * Send email to the admin
      await this.transporter.sendMail({
        from: envs.emailUser,
        to: envs.emailUser,
        subject: 'Contact',
        html: `<h1>Contact</h1><p>${body.name}</p><p>${body.email}</p><p>${body.consulta}</p>`,
      });
      // * Send email to the user
      await this.transporter.sendMail({
        from: envs.emailUser,
        to: body.email,
        subject: 'Contact',
        html: `<h1>Contact</h1><p>Thanks for contacting us, your message has been recieved, we will contact you soon</p>`,
      });
      return { message: 'Thanks for contacting us, check your email' };
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
        secret: secret.base32,
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

  async verify2faCode(verifiyTwoFactorDto: VerifyTwoFactorDto) {
    try {
      const user = (await this.usersService.findUserByEmail(
        verifiyTwoFactorDto.email,
      )) as User;
      if (!user) throw new NotFoundException('User not found');
      if (!user.twoFactorAuth) throw new BadRequestException('2FA not enabled');

      const isValid = speakeasy.totp.verify({
        secret: user.twoFactorAuth,
        encoding: 'base32',
        token: verifiyTwoFactorDto.token,
      });

      if (!isValid) throw new BadRequestException('Invalid 2FA code');
      return { message: '2FA code verified', user: this.refreshToken(user) };
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
      expiresIn: expiresIn || '1h',
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
      const url = `${envs.frontendUrl}api/v1/auth/set-password?_t=${token}`;
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
