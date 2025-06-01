// Objective: Implement the module for the user entity.

//* NestJS modules
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { UsersService } from './users.service';
import { UserCleanupService } from '@common/cleanBBDD/userCleanUp.service';

//* Controllers
import { UsersController } from './users.controller';

//* Entities
import { User, UserSchema } from './entities/user.entity';
import {
  Carrier,
  CarrierSchema,
} from '@modules/carriers/entities/carrier.entity';
import { Client, ClientSchema } from '@modules/clients/entities/client.entity';
import {
  AuditLog,
  AuditLogSchema,
} from '@modules/audit-logs/entities/audit-log.entity';

//* Modules
import { CommonModule } from '@common/common.module';
import { ClientsModule } from '@modules/clients/clients.module';
import { CarriersModule } from '@modules/carriers/carriers.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';
import { SendEmailUserAdminService } from '@common/cleanBBDD/sendEmailUserAdmin.service';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserCleanupService, SendEmailUserAdminService],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    CommonModule,
    ConfigModule,
    ClientsModule,
    CarriersModule,
    AuditLogsModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Carrier.name,
        schema: CarrierSchema,
      },
      {
        name: Client.name,
        schema: ClientSchema,
      },
      {
        name: AuditLog.name,
        schema: AuditLogSchema,
      },
    ]),
  ],
})
export class UsersModule {}
