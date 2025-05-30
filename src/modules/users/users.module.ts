// Objective: Implement the module for the user entity.

//* NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { UsersService } from './users.service';

//* Controllers
import { UsersController } from './users.controller';

//* Entities
import { User, UserSchema } from './entities/user.entity';

//* Modules
import { CommonModule } from '@common/common.module';
import { ClientsModule } from '@modules/clients/clients.module';
import { CarriersModule } from '@modules/carriers/carriers.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
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
    ]),
  ],
})
export class UsersModule {}
