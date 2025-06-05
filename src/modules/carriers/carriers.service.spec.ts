import { CarriersService } from './carriers.service';
import { Model } from 'mongoose';
import { Carrier } from './entities/carrier.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UsersService } from '../users/users.service';
import { TrucksService } from '../trucks/trucks.service';

describe('CarriersService', () => {
  let service: CarriersService;
  let model: jest.Mocked<Model<Carrier>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;
  let users: jest.Mocked<UsersService>;
  let trucks: jest.Mocked<TrucksService>;
  let routes: { findRoutesByCarrier: jest.Mock };

  beforeEach(() => {
    model = {
      create: jest.fn(),
      countDocuments: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<Model<Carrier>>;
    exceptions = { handleDBExceptions: jest.fn() } as jest.Mocked<ExceptionsService>;
    audits = { create: jest.fn() } as jest.Mocked<AuditLogsService>;
    users = {} as jest.Mocked<UsersService>;
    trucks = { updateTruckStatus: jest.fn(), findOne: jest.fn() } as jest.Mocked<TrucksService>;
    routes = {
      findRoutesByCarrier: jest.fn(),
      unassignRouteFromCarrierRemoved: jest.fn(),
    } as { findRoutesByCarrier: jest.Mock; unassignRouteFromCarrierRemoved: jest.Mock };
    service = new CarriersService(model, exceptions, audits, users, trucks);
    (service as unknown as { routesService: typeof routes }).routesService = routes;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create delegates to model', async () => {
    await service.create({} as Record<string, never>, 'u');
    expect(model.create).toHaveBeenCalled();
  });

  it('getCarriersCount uses model', async () => {
    model.countDocuments.mockResolvedValue(3);
    await expect(service.getCarriersCount()).resolves.toBe(3);
  });

  it('remove deletes carrier', async () => {
    model.findByIdAndDelete.mockResolvedValue({ truck: { _id: 't' } } as unknown as Carrier);
    await service.remove('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });

  it('findCarrierWithPopulatedData calls findById', async () => {
    model.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue('c'),
    } as unknown as ReturnType<Model<Carrier>['findById']>);
    await service.findCarrierWithPopulatedData('2');
    expect(model.findById).toHaveBeenCalledWith('2');
  });
});
