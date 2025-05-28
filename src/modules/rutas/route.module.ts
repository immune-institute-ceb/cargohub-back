// Objective: Implement the module for the routes entity.

//* NestJS modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { RoutesService } from './route.service';

//* Controllers
import { RoutesController } from './route.controller';

//* Entities
import { Route, RouteSchema } from './entities/route.entity';

//* Modules
import { CommonModule } from '@common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    CommonModule,
    ConfigModule,
    PassportModule,
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
