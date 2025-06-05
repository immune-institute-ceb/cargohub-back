import { TrucksService } from './trucks.service';
import { Model } from 'mongoose';
import { Truck } from './entities/truck.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { UsersService } from '../users/users.service';

describe('TrucksService', () => {
  let service: TrucksService;
  let model: jest.Mocked<Model<Truck>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;
  let users: jest.Mocked<UsersService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as unknown as jest.Mocked<Model<Truck>>;
    exceptions = { handleDBExceptions: jest.fn() } as unknown as jest.Mocked<ExceptionsService>;
    audits = { create: jest.fn() } as unknown as jest.Mocked<AuditLogsService>;
    users = {} as unknown as jest.Mocked<UsersService>;
    service = new TrucksService(model, exceptions, audits, users);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    await service.create({} as Record<string, never>);
    expect(model.create).toHaveBeenCalled();
  });

  it('findAll uses find', async () => {
    model.find.mockReturnValue([] as unknown as ReturnType<Model<Truck>['find']>);
    await service.findAll();
    expect(model.find).toHaveBeenCalled();
  });

  it('findOne uses findById', async () => {
    model.findById.mockReturnValue({} as unknown as ReturnType<Model<Truck>['findById']>);
    await service.findOne('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('remove uses findByIdAndDelete', async () => {
    model.findByIdAndDelete.mockResolvedValue({} as unknown as Truck);
    await service.remove('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
