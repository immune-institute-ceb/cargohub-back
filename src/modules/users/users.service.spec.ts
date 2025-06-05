import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';

describe('UsersService', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<User>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;
  let clients: jest.Mocked<ClientsService>;
  let carriers: jest.Mocked<CarriersService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as any;
    exceptions = { handleDBExceptions: jest.fn() } as any;
    audits = { create: jest.fn() } as any;
    clients = { findDuplicateClient: jest.fn() } as any;
    carriers = { finByDni: jest.fn() } as any;
    service = new UsersService(model, exceptions, audits, clients, carriers);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create uses model', async () => {
    clients.findDuplicateClient.mockResolvedValue(undefined);
    carriers.finByDni.mockResolvedValue(undefined);
    model.create.mockResolvedValue({} as any);
    await service.create({ roles: [] } as any);
    expect(model.create).toHaveBeenCalled();
  });

  it('getUser uses findOne', async () => {
    model.findOne.mockReturnValue({} as any);
    await service.getUser({} as any);
    expect(model.findOne).toHaveBeenCalled();
  });

  it('deleteUser uses findByIdAndDelete', async () => {
    model.findByIdAndDelete.mockResolvedValue({} as any);
    await service.deleteUser({ _id: '1' } as any);
    expect(model.findByIdAndDelete).toHaveBeenCalled();
  });

  it('deleteUserByAdmin uses findByIdAndDelete', async () => {
    model.findByIdAndDelete.mockResolvedValue({} as any);
    await service.deleteUserByAdmin('1');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
