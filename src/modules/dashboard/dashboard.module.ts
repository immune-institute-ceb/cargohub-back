import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
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
