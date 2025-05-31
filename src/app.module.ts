// Objective : Main module of the application, where all the modules are imported and the configuration is set up.

//* NestJS modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

//* Config
import { envs } from './config/envs';
import { ConfigModule } from '@nestjs/config';

//* Modules
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { BillingModule } from './modules/facturacion/billing.module';
import { RoutesModule } from './modules/rutas/route.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { RequestsModule } from '@modules/requests/requests.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/config/env/.env',
    }),
    MongooseModule.forRoot(envs.mongodbUri, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    BillingModule,
    RoutesModule,
    ClientsModule,
    CarriersModule,
    RequestsModule,
    TrucksModule,
    AuditLogsModule,
    DashboardModule,
  ],
})
export class AppModule {}
