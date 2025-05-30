// Objective: Implement the module to manage the authentication of the application.
//* NestJS modules
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@config/envs';
import { PassportModule } from '@nestjs/passport';

//* Strategies
import { JwtLoginStrategy } from './strategies/jwt-login.strategy';
import { JwtRecoverPasswordStrategy } from './strategies/jwt-recover-password.strategy';

//* Services
import AuthService from './auth.service';

//* Controllers
import { AuthController } from './auth.controller';

//* Modules
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtLoginStrategy, JwtRecoverPasswordStrategy],
  imports: [
    UsersModule,
    CommonModule,
    AuditLogsModule,
    // Passport module to manage authentication
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // JWT module to manage JWT tokens
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envs.jwtSecret,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  exports: [
    JwtLoginStrategy,
    JwtRecoverPasswordStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
