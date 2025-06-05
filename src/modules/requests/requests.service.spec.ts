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
    } as any;
    exceptions = { handleDBExceptions: jest.fn() } as any;
    routes = { create: jest.fn() } as any;
    clients = { findOne: jest.fn(), addRequestToClient: jest.fn() } as any;
    billing = { createBillingFromRequest: jest.fn() } as any;
    audits = { create: jest.fn() } as any;
    service = new RequestsService(model, exceptions, routes, clients, billing, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    clients.findOne.mockResolvedValue({ _id: 'c', requests: [] } as any);
    routes.create.mockResolvedValue({ _id: 'r' } as any);
    await service.create({ origin: 'o', destination: 'd' } as any, { _id: 'u' } as any);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAllRequestsByClientId uses find', async () => {
    model.find.mockReturnValue([] as any);
    clients.findOne.mockResolvedValue({ _id: 'c' } as any);
    await service.findAllRequestsByClientId('c');
    expect(model.find).toHaveBeenCalled();
  });

  it('findOne uses findById', async () => {
    model.findById.mockReturnValue({} as any);
    await service.findOne('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('remove uses findByIdAndDelete', async () => {
    model.findByIdAndDelete.mockResolvedValue({} as any);
    await service.remove('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
