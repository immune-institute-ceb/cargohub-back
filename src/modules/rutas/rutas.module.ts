// Objective: Implement the module for the routes entity.

//* NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { RutasService } from './rutas.service';

//* Controllers
import { RutasController } from './rutas.controller';

//* Entities
import { Ruta, RutaSchema } from './entities/rutas.entity';

//* Modules
import { CommonModule } from '@common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ruta.name, schema: RutaSchema }]),
    CommonModule,
    ConfigModule,
    PassportModule,
  ],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
