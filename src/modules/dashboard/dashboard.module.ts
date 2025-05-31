// Objective: Implement the module to manage the dashboard functionality in the application.

//* NestJS modules
import { Module } from '@nestjs/common';

// * Services
import { DashboardService } from './dashboard.service';

// * Controllers
import { DashboardController } from './dashboard.controller';

// * Modules
import { ClientsModule } from '@modules/clients/clients.module';
import { CarriersModule } from '@modules/carriers/carriers.module';
import { BillingModule } from '@modules/facturacion/billing.module';
import { RequestsModule } from '@modules/requests/requests.module';
import { RoutesModule } from '@modules/rutas/route.module';
import { CommonModule } from '@common/common.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [
    CommonModule,
    ClientsModule,
    CarriersModule,
    BillingModule,
    RequestsModule,
    RoutesModule,
  ],
})
export class DashboardModule {}
