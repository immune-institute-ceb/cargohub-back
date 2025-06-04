// Objective: Implement the controller of the authentication module, with the endpoints for the user to register,
//  login, reset password, recover password, refresh token, contact, generate 2fa code, verify 2fa code and disable 2fa code.
//* Nest Modules
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

//* DTOs
import {
  SetPasswordDto,
  Generate2faCodeResponseDto,
  LoginResponseDto,
  LoginUserDto,
  RecoverPasswordDto,
  RegisterUserAdminManagerDto,
  RegisterUserDto,
  TwoFactorDto,
  VerifyTwoFactorDto,
  ChangePasswordDto,
} from './dto';

//* External modules
import { Request } from 'express';

//* Decorators
import { Auth, GetTokenFromHeader, GetUser } from './decorators';

//* Entities
import { User } from '../users/entities/user.entity';

//* Services
import AuthService from './auth.service';

//* Interfaces
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@ApiNotFoundResponse({
  description: 'Not Found',
  schema: {
    oneOf: [{ example: { message: 'User not found' } }],
  },
})
@ApiBadRequestResponse({
  description: 'Bad Request',
  schema: {
    oneOf: [
      { example: { message: 'Passwords do not match' } },
      { example: { message: 'Email confirmation token expired' } },
      { example: { message: 'Not valid credentials' } },
      { example: { message: 'Failed to generate OTP Auth URL' } },
      { example: { message: '2FA already enabled' } },
      { example: { message: '2FA not enabled' } },
    ],
  },
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error, check the logs',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  schema: {
    oneOf: [
      { example: { message: 'Unauthorized' } },
      { example: { message: 'User is inactive, talk with an admin' } },
      { example: { message: 'Not valid token' } },
    ],
  },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User created, check your email to confirm your account',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'User already exists in the database' } },
        { example: { message: 'Duplicate client or carrier data found' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Register a new user' })
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('register/adminManager')
  @ApiCreatedResponse({
    description: 'User created, check your email to confirm your account',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'User already exists in the database' } },
        { example: { message: 'Duplicate client or carrier data found' } },
      ],
    },
  })
  @ApiBearerAuth()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Register a new user with adminManager role' })
  registerUserAdminManager(
    @Body() registerUserAdminManagerDto: RegisterUserAdminManagerDto,
  ) {
    return this.authService.registerUserAdminManager(
      registerUserAdminManagerDto,
    );
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'User Logged In',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Authentication failure',
    schema: {
      oneOf: [
        { example: { message: 'Not valid credentials' } },
        { example: { message: 'Not valid credentials' } },
        { example: { message: 'User is inactive, talk with an admin' } },
        { example: { message: '2FA code is required' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Login a user' })
  loginUser(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.authService.login(loginUserDto, req);
  }

  @Post('set-password')
  @ApiResponse({
    status: 200,
    description: 'Password updated',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error, check the logs',
    schema: {
      oneOf: [
        { example: { message: 'Token not found (request)' } },
        { example: { message: 'Token expired' } },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid token or password mismatch',
    schema: {
      oneOf: [
        { example: { message: 'Email confirmation token expired' } },
        { example: { message: 'Passwords do not match' } },
        { example: { message: 'Invalid token purpose' } },
      ],
    },
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset user password' })
  @UseGuards(AuthGuard('jwt-recover-password'))
  resetPassword(
    @GetTokenFromHeader() token: string,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.authService.resetPassword(token, setPasswordDto);
  }

  @Post('recover-password')
  @ApiResponse({
    status: 200,
    description: 'Email sent, check your inbox',
  })
  @ApiOperation({ summary: 'Sends an email with a link to reset the password' })
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }

  @Patch('change-password')
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Passwords do not match',
    schema: {
      oneOf: [{ example: { message: 'Passwords do not match' } }],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Old password is incorrect',
  })
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @Auth()
  changePasswordUser(
    @GetUser() user,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user as User, changePasswordDto);
  }

  @Get('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Authentication failure',
    schema: {
      oneOf: [
        { example: { message: 'Not valid token' } },
        { example: { message: 'User is inactive, talk with an admin' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiBearerAuth()
  @Auth()
  refreshTokenUser(@GetUser() user) {
    return this.authService.refreshToken(user as User);
  }

  @Get('verify-session-token')
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Authentication failure',
    schema: {
      oneOf: [
        { example: { message: 'Not valid token' } },
        { example: { message: 'Unauthorized' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Verify user session token' })
  @ApiBearerAuth()
  @Auth()
  verifyTokenSessionUser(@GetTokenFromHeader() token: string) {
    return this.authService.verifyToken(token);
  }

  @Get('verify-email-token')
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Authentication failure',
    schema: {
      oneOf: [
        { example: { message: 'Not valid token' } },
        { example: { message: 'Unauthorized' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Verify user email token' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-recover-password'))
  verifyTokenEmailUser(@GetTokenFromHeader() token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('2fa/generate')
  @ApiCreatedResponse({
    description: '2FA code generated',
    type: Generate2faCodeResponseDto,
  })
  @ApiOperation({ summary: 'Generate a new 2FA code' })
  @ApiBadRequestResponse({
    description: 'Bad Request - 2FA already enabled',
    schema: {
      oneOf: [
        { example: { message: '2FA already enabled' } },
        { example: { message: 'Failed to generate OTP Auth URL' } },
        { example: { message: 'Failed to generate QR code' } },
      ],
    },
  })
  @ApiBearerAuth()
  @Auth()
  generate2faCode(@GetUser() user) {
    return this.authService.generate2faCode(user as User);
  }

  @Post('2fa/activate')
  @ApiResponse({
    status: 200,
    description: '2FA code activated',
  })
  @ApiOperation({ summary: 'Activate 2FA code' })
  @ApiBadRequestResponse({
    description: 'Bad Request - 2FA not enabled',
    schema: {
      oneOf: [
        { example: { message: '2FA not enabled' } },
        { example: { message: '2FA already enabled' } },
        { example: { message: 'Invalid 2FA code' } },
      ],
    },
  })
  @ApiBearerAuth()
  @Auth()
  activateTwoFactorCode(@GetUser() user, @Body() token: TwoFactorDto) {
    return this.authService.activateTwoFactorCode(user as User, token);
  }

  @Post('2fa/email/activate')
  @ApiResponse({
    status: 200,
    description: '2FA code activated',
  })
  @ApiOperation({ summary: 'Activate 2FA code' })
  @ApiBadRequestResponse({
    description: 'Bad Request - 2FA not enabled',
    schema: {
      oneOf: [
        { example: { message: '2FA not enabled' } },
        { example: { message: '2FA already enabled' } },
        { example: { message: 'Invalid 2FA code' } },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-recover-password'))
  activateEmailTwoFactorCode(
    @GetTokenFromHeader() token: string,
    @Body() token2fa: TwoFactorDto,
  ) {
    return this.authService.activateEmailTwoFactorCode(token, token2fa);
  }

  @Post('2fa/verify')
  @ApiResponse({
    status: 200,
    description: '2FA code verified',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request - Invalid 2FA code',
    schema: {
      oneOf: [
        { example: { message: 'Invalid 2FA code' } },
        { example: { message: '2FA not enabled' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Verify 2FA code' })
  verify2faCode(
    @Body() verifyTwoFactorDto: VerifyTwoFactorDto,
    @Req() req: Request,
  ) {
    return this.authService.verify2faCode(verifyTwoFactorDto, req);
  }

  @Patch('2fa/disable')
  @ApiResponse({
    status: 200,
    description: '2FA code disabled',
  })
  @ApiBadRequestResponse({ description: 'Bad Request - 2FA not enabled' })
  @ApiOperation({ summary: 'Disable 2FA code' })
  @ApiBearerAuth()
  @Auth()
  disableTwoFactor(@GetUser() user) {
    return this.authService.disableTwoFactor(user as User);
  }
}
