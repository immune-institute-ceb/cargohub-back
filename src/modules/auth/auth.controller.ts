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

//* DTOs
import {
  ChangePasswordDto,
  ContactDto,
  Generate2faCodeResponseDto,
  LoginResponseDto,
  LoginUserDto,
  RecoverPasswordDto,
  RegisterUserDto,
  TwoFactorDto,
  VerifyTwoFactorDto,
} from './dto';

//* Decorators
import { Auth, GetTokenFromHeader, GetUser } from './decorators';

//* Entities
import { User } from '../users/entities/user.entity';

//* Services
import AuthService from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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
      { example: { message: 'User is archived' } },
      { example: { message: 'Not valid token' } },
    ],
  },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User Registered',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'Register a new user' })
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
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
        { example: { message: 'User is archived' } },
        { example: { message: 'User is inactive, talk with an admin' } },
        { example: { message: '2FA code is required' } },
        { example: { message: 'Invalid 2FA code' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Login a user' })
  loginUser(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.authService.login(loginUserDto, req);
  }

  @Post('reset-password')
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
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.resetPassword(token, changePasswordDto);
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

  @Get('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Authentication failure',
    schema: {
      oneOf: [
        { example: { message: 'Not valid token' } },
        { example: { message: 'User is inactive, talk with an admin' } },
        { example: { message: 'User is archived' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiBearerAuth()
  @Auth()
  refreshTokenUser(@GetUser() user) {
    return this.authService.refreshToken(user as User);
  }

  @Get('verify-token')
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
  @ApiOperation({ summary: 'Verify user token' })
  @ApiBearerAuth()
  @Auth()
  verifyTokenUser(@GetTokenFromHeader() token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('contact')
  @ApiResponse({
    status: 200,
    description: 'Thanks for contacting us, check your email',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error, check the logs',
    schema: {
      oneOf: [
        { example: { message: 'Failed to send email' } },
        { example: { message: 'Failed to send email to admin' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Contact via email' })
  contact(@Body() body: ContactDto) {
    return this.authService.contact(body);
  }

  @Post('2fa/generate')
  @ApiCreatedResponse({
    description: '2FA code generated',
    type: Generate2faCodeResponseDto,
  })
  @ApiOperation({ summary: 'Generate a new 2FA code' })
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
  @ApiBearerAuth()
  @Auth()
  activateTwoFactorCode(@GetUser() user, @Body() token: TwoFactorDto) {
    return this.authService.activateTwoFactorCode(user as User, token);
  }

  @Post('2fa/verify')
  @ApiResponse({
    status: 200,
    description: '2FA code verified',
    type: LoginResponseDto,
  })
  @ApiOperation({ summary: 'Verify 2FA code' })
  verify2faCode(@Body() verifyTwoFactorDto: VerifyTwoFactorDto) {
    return this.authService.verify2faCode(verifyTwoFactorDto);
  }

  @Patch('2fa/disable')
  @ApiResponse({
    status: 200,
    description: '2FA code disabled',
  })
  @ApiOperation({ summary: 'Disable 2FA code' })
  @ApiBearerAuth()
  @Auth()
  disableTwoFactor(@GetUser() user) {
    return this.authService.disableTwoFactor(user as User);
  }
}
