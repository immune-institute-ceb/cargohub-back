// Objective: Implement the module for the routes entity.

//* NestJS modules
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//* Services
import { RoutesService } from './route.service';

//* Controllers
import { RoutesController } from './route.controller';

//* Entities
import { Route, RouteSchema } from './entities/route.entity';

//* Modules
import { CommonModule } from '@common/common.module';
import { CarriersModule } from '@modules/carriers/carriers.module';
import { RequestsModule } from '@modules/requests/requests.module';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService],
  imports: [
    CommonModule,
    forwardRef(() => CarriersModule),
    forwardRef(() => RequestsModule),
    MongooseModule.forFeature([
      {
        name: Route.name,
        schema: RouteSchema,
      },
    ]),
  ],
  exports: [RoutesService],
})
export class RoutesModule {}
