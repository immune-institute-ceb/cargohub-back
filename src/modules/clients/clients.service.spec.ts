import { ClientsService } from './clients.service';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { RequestsService } from '../requests/requests.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('ClientsService', () => {
  let service: ClientsService;
  let model: jest.Mocked<Model<Client>>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let requests: jest.Mocked<RequestsService>;
  let audits: jest.Mocked<AuditLogsService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
      countDocuments: jest.fn(),
    } as jest.Mocked<Model<Client>>;
    exceptions = { handleDBExceptions: jest.fn() } as jest.Mocked<ExceptionsService>;
    requests = { findOne: jest.fn() } as jest.Mocked<RequestsService>;
    audits = { create: jest.fn() } as jest.Mocked<AuditLogsService>;
    service = new ClientsService(model, exceptions, requests, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create delegates to model', async () => {
    await service.create({} as Record<string, never>, 'u');
    expect(model.create).toHaveBeenCalled();
  });

  it('findAll uses model', async () => {
    model.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue('x'),
    } as unknown as ReturnType<Model<Client>['find']>);
    await service.findAll();
    expect(model.find).toHaveBeenCalled();
  });

  it('findOne uses model', async () => {
    model.findById.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue('x'),
    } as unknown as ReturnType<Model<Client>['findById']>);
    await service.findOne('1');
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('getActiveClientsCount uses model', async () => {
    model.countDocuments.mockResolvedValue(2);
    await expect(service.getActiveClientsCount()).resolves.toBe(2);
  });

  it('update uses model', async () => {
    model.findOneAndUpdate.mockResolvedValue('c' as unknown as Client);
    await service.update('1', {} as Record<string, never>);
    expect(model.findOneAndUpdate).toHaveBeenCalled();
  });
});
