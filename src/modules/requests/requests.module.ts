// Objective: Implement the Requests module for handling requests in the application.

//* NestJS modules
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//* Services
import { RequestsService } from './requests.service';

//* Controllers
import { RequestsController } from './requests.controller';

//* Entities
import { Requests, RequestSchema } from './entities/request.entity';

// * Modules
import { CommonModule } from '@common/common.module';
import { ClientsModule } from '@modules/clients/clients.module';
import { RoutesModule } from '@modules/rutas/route.module';
import { BillingModule } from '@modules/facturacion/billing.module';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  imports: [
    CommonModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => RoutesModule),
    forwardRef(() => BillingModule),
    MongooseModule.forFeature([
      {
        name: Requests.name,
        schema: RequestSchema,
      },
    ]),
  ],
  exports: [RequestsService],
})
export class RequestsModule {}
