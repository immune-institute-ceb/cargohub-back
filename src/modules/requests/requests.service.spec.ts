import { RequestsService } from './requests.service';
import { Model } from 'mongoose';
import { Requests } from './entities/request.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { RoutesService } from '../rutas/route.service';
import { ClientsService } from '../clients/clients.service';
import { BillingService } from '../facturacion/billing.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let model: jest.Mocked<Model<Requests>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let routes: jest.Mocked<RoutesService>;
  let clients: jest.Mocked<ClientsService>;
  let billing: jest.Mocked<BillingService>;
  let audits: jest.Mocked<AuditLogsService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as jest.Mocked<Model<Requests>>;
    exceptions = { handleDBExceptions: jest.fn() } as jest.Mocked<ExceptionsService>;
    routes = { create: jest.fn() } as jest.Mocked<RoutesService>;
    clients = { findOne: jest.fn(), addRequestToClient: jest.fn() } as jest.Mocked<ClientsService>;
    billing = { createBillingFromRequest: jest.fn() } as jest.Mocked<BillingService>;
    audits = { create: jest.fn() } as jest.Mocked<AuditLogsService>;
    service = new RequestsService(model, exceptions, routes, clients, billing, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    clients.findOne.mockResolvedValue({ _id: 'c', requests: [] } as unknown as Parameters<typeof service.create>[1] & { _id: string });
    routes.create.mockResolvedValue({ _id: 'r' } as unknown as ReturnType<RoutesService['create']>);
    await service.create({ origin: 'o', destination: 'd' } as Record<string, string>, { _id: 'u' } as unknown as Parameters<typeof service.create>[1]);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAllRequestsByClientId uses find', async () => {
    model.find.mockReturnValue([] as unknown as ReturnType<Model<Requests>['find']>);
    clients.findOne.mockResolvedValue({ _id: 'c' } as unknown as Parameters<ClientsService['findOne']>[0]);
    await service.findAllRequestsByClientId('c');
    expect(model.find).toHaveBeenCalled();
  });

  it('findOne uses findById', async () => {
    model.findById.mockReturnValue({} as unknown as ReturnType<Model<Requests>['findById']>);
    await service.findOne('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('remove uses findByIdAndDelete', async () => {
    model.findByIdAndDelete.mockResolvedValue({} as unknown as Requests);
    await service.remove('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
