// Objective: Implement the module for the facturacion entity.

//* NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { FacturacionService } from './facturacion.service';

//* Controllers
import { FacturacionController } from './facturacion.controller';

//* Entities
import { Facturacion, FacturacionSchema } from './entities/facturacion.entity';

//* Modules
import { CommonModule } from '@common/common.module';

@Module({
  controllers: [FacturacionController],
  providers: [FacturacionService],
  exports: [FacturacionService],
  imports: [
    CommonModule,
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([
      {
        name: Facturacion.name,
        schema: FacturacionSchema,
      },
    ]),
  ],
})
export class FacturacionModule {}
