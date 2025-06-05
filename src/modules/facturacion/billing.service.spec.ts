import { BillingService } from './billing.service';
import { Model, Types } from 'mongoose';
import { Billing } from './entities/billing.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { RoutesService } from '../rutas/route.service';
import { RequestsService } from '../requests/requests.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('BillingService', () => {
  let service: BillingService;
  let model: jest.Mocked<Model<Billing>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let routes: jest.Mocked<RoutesService>;
  let requests: jest.Mocked<RequestsService>;
  let audits: jest.Mocked<AuditLogsService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
    } as any;
    exceptions = { handleDBExceptions: jest.fn() } as any;
    routes = {} as any;
    requests = {} as any;
    audits = { create: jest.fn() } as any;
    service = new BillingService(model, exceptions, routes, requests, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createBillingFromRequest uses model', async () => {
    await service.createBillingFromRequest({ routeId: new Types.ObjectId(), _id: new Types.ObjectId(), clientId: new Types.ObjectId() } as any);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAllBillings uses find', async () => {
    model.find.mockReturnValue({} as any);
    await service.findAllBillings();
    expect(model.find).toHaveBeenCalled();
  });

  it('findBillingById uses findById', async () => {
    model.findById.mockReturnValue({} as any);
    await service.findBillingById('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('getMensualBilling aggregates', async () => {
    model.find.mockReturnValue({} as any);
    await service.getMensualBilling();
    expect(model.find).toHaveBeenCalled();
  });
});
