import { RoutesService } from './route.service';
import { Model } from 'mongoose';
import { Route } from './entities/route.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CarriersService } from '../carriers/carriers.service';
import { RequestsService } from '../requests/requests.service';

describe('RoutesService', () => {
  let service: RoutesService;
  let model: jest.Mocked<Model<Route>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;
  let carriers: jest.Mocked<CarriersService>;
  let requests: jest.Mocked<RequestsService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
    } as unknown as jest.Mocked<Model<Route>>;
    exceptions = { handleDBExceptions: jest.fn() } as unknown as jest.Mocked<ExceptionsService>;
    audits = { create: jest.fn() } as unknown as jest.Mocked<AuditLogsService>;
    carriers = { findOne: jest.fn() } as unknown as jest.Mocked<CarriersService>;
    requests = {} as unknown as jest.Mocked<RequestsService>;
    service = new RoutesService(model, exceptions, carriers, requests, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    await service.create({ origin: 'o', destination: 'd' }, {} as unknown as Parameters<RoutesService['create']>[1]);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAllRoutes uses model', async () => {
    model.find.mockReturnValue({
      populate: jest.fn().mockReturnValue([]),
    } as unknown as ReturnType<Model<Route>['find']>);
    await service.findAllRoutes();
    expect(model.find).toHaveBeenCalled();
  });

  it('findRouteById uses model', async () => {
    model.findById.mockReturnValue({} as unknown as ReturnType<Model<Route>['findById']>);
    await service.findRouteById('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('assignCarrierToRoute updates route', async () => {
    model.updateOne.mockResolvedValue({} as unknown as ReturnType<Model<Route>['updateOne']>);
    await service.assignCarrierToRoute('r', 'c');
    expect(model.updateOne).toHaveBeenCalled();
  });
});
