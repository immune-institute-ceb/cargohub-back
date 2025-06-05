import { RoutesService } from './route.service';
import { Model } from 'mongoose';
import { Route } from './entities/route.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CarriersService } from '../carriers/carriers.service';
import { TrucksService } from '../trucks/trucks.service';

describe('RoutesService', () => {
  let service: RoutesService;
  let model: jest.Mocked<Model<Route>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;
  let carriers: jest.Mocked<CarriersService>;
  let trucks: jest.Mocked<TrucksService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
    } as any;
    exceptions = { handleDBExceptions: jest.fn() } as any;
    audits = { create: jest.fn() } as any;
    carriers = { findOne: jest.fn() } as any;
    trucks = {} as any;
    service = new RoutesService(model, exceptions, audits, carriers, trucks);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    await service.create({ origin: 'o', destination: 'd' } as any, {} as any);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAllRoutes uses model', async () => {
    model.find.mockReturnValue({ populate: jest.fn().mockReturnValue([]) } as any);
    await service.findAllRoutes();
    expect(model.find).toHaveBeenCalled();
  });

  it('findRouteById uses model', async () => {
    model.findById.mockReturnValue({} as any);
    await service.findRouteById('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('assignCarrierToRoute updates route', async () => {
    model.updateOne.mockResolvedValue({} as any);
    await service.assignCarrierToRoute('r', 'c');
    expect(model.updateOne).toHaveBeenCalled();
  });
});
