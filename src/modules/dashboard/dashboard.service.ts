import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { CarriersService } from '@modules/carriers/carriers.service';
import { ClientsService } from '@modules/clients/clients.service';
import { BillingService } from '@modules/facturacion/billing.service';
import { RequestsService } from '@modules/requests/requests.service';
import { RoutesService } from '@modules/rutas/route.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly carriersService: CarriersService,
    private readonly billingService: BillingService,
    private readonly requestsService: RequestsService,
    private readonly routesService: RoutesService,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async getDashboardSummary() {
    try {
      const [clients, carriers, billing, routes] = await Promise.all([
        this.clientsService.getActiveClientsCount(),
        this.carriersService.getCarriersCount(),
        this.billingService.getMensualBilling(),
        this.routesService.getInTransitRoutesCount(),
      ]);

      const yearRequestsPendingByMonth =
        await this.requestsService.getYearRequestsPendingCountByMonth();
      const yearRequestsCompletedByMonth =
        await this.requestsService.getYearRequestsCompletedCountByMonth();

      const requestsStatus =
        await this.requestsService.getRequestsStatusCount();
      return {
        kpis: {
          activeClients: clients,
          carriers,
          activeRoutes: routes,
          monthlyRevenue: billing,
        },
        monthlyRequests: {
          completed: yearRequestsCompletedByMonth,
          pending: yearRequestsPendingByMonth,
        },
        requestsStatus,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
