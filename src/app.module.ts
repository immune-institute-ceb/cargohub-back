// Objective : Main module of the application, where all the modules are imported and the configuration is set up.

//* NestJS modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//* Modules
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { FacturacionModule } from './modules/facturacion/facturacion.module';
import { envs } from './config/envs';
import { ConfigModule } from '@nestjs/config';
import { RutasModule } from './modules/rutas/rutas.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { RequestsModule } from '@modules/requests/requests.module';

@Module({
  imports: [
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
    FacturacionModule,
    RutasModule,
    ClientsModule,
    CarriersModule,
    RequestsModule,
  ],
})
export class AppModule {}
