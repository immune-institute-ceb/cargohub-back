import { DashboardService } from './dashboard.service';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';
import { BillingService } from '../facturacion/billing.service';
import { RequestsService } from '../requests/requests.service';
import { RoutesService } from '../rutas/route.service';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let clients: jest.Mocked<ClientsService>;
  let carriers: jest.Mocked<CarriersService>;
  let billing: jest.Mocked<BillingService>;
  let requests: jest.Mocked<RequestsService>;
  let routes: jest.Mocked<RoutesService>;
  let exceptions: jest.Mocked<ExceptionsService>;

  beforeEach(() => {
    clients = { getActiveClientsCount: jest.fn().mockResolvedValue(5) } as unknown as jest.Mocked<ClientsService>;
    carriers = { getCarriersCount: jest.fn().mockResolvedValue(2) } as unknown as jest.Mocked<CarriersService>;
    billing = { getMensualBilling: jest.fn().mockResolvedValue(100) } as unknown as jest.Mocked<BillingService>;
    requests = {
      getYearRequestsPendingCountByMonth: jest.fn().mockResolvedValue([0]),
      getYearRequestsCompletedCountByMonth: jest.fn().mockResolvedValue([1]),
      getRequestsStatusCount: jest.fn().mockResolvedValue({ pending: 1 }),
    } as unknown as jest.Mocked<RequestsService>;
    routes = { getInTransitRoutesCount: jest.fn().mockResolvedValue(3) } as unknown as jest.Mocked<RoutesService>;
    exceptions = { handleDBExceptions: jest.fn() } as unknown as jest.Mocked<ExceptionsService>;

    service = new DashboardService(clients, carriers, billing, requests, routes, exceptions);
  });

  it('returns dashboard summary', async () => {
    await expect(service.getDashboardSummary()).resolves.toEqual({
      kpis: { activeClients: 5, carriers: 2, activeRoutes: 3, monthlyRevenue: 100 },
      monthlyRequests: { completed: [1], pending: [0] },
      requestsStatus: { pending: 1 },
    });
  });

  it('delegates errors to ExceptionService', async () => {
    const error = new Error('fail');
    clients.getActiveClientsCount.mockRejectedValue(error);
    await service.getDashboardSummary();
    expect(exceptions.handleDBExceptions).toHaveBeenCalledWith(error);
  });

  it('calls dependent services', async () => {
    await service.getDashboardSummary();
    expect(clients.getActiveClientsCount).toHaveBeenCalled();
    expect(carriers.getCarriersCount).toHaveBeenCalled();
    expect(billing.getMensualBilling).toHaveBeenCalled();
    expect(routes.getInTransitRoutesCount).toHaveBeenCalled();
  });

  it('combines monthly request data', async () => {
    await expect(service.getDashboardSummary()).resolves.toHaveProperty('monthlyRequests');
    expect(requests.getYearRequestsCompletedCountByMonth).toHaveBeenCalled();
    expect(requests.getYearRequestsPendingCountByMonth).toHaveBeenCalled();
  });

  it('returns numeric revenue', async () => {
    await expect(service.getDashboardSummary()).resolves.toHaveProperty('kpis.monthlyRevenue', 100);
  });
});
