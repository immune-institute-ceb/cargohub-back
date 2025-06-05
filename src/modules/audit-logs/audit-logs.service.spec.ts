import { Model } from 'mongoose';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './entities/audit-log.entity';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  let model: jest.Mocked<Model<AuditLog>>;
  let exceptions: jest.Mocked<ExceptionsService>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
    } as unknown as jest.Mocked<Model<AuditLog>>;

    exceptions = {
      handleDBExceptions: jest.fn(),
    } as jest.Mocked<ExceptionsService>;

    service = new AuditLogsService(model, exceptions);
  });

  it('creates a log entry', async () => {
    await service.create({ level: 'info', context: 't', message: 'm' } as CreateAuditLogDto);
    expect(model.create).toHaveBeenCalled();
  });

  it('handles errors on create', async () => {
    const error = new Error('fail');
    (model.create as jest.Mock).mockRejectedValue(error);
    await service.create({} as CreateAuditLogDto);
    expect(exceptions.handleDBExceptions).toHaveBeenCalledWith(error);
  });

  it('retrieves logs sorted', () => {
    const query = { sort: jest.fn().mockReturnValue('logs') } as { sort: jest.Mock };
    (model.find as jest.Mock).mockReturnValue(query);
    const result = service.findAll();
    expect(model.find).toHaveBeenCalled();
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toBe('logs');
  });

  it('findAll delegates errors', () => {
    const error = new Error('fail');
    (model.find as jest.Mock).mockImplementation(() => {
      throw error;
    });
    service.findAll();
    expect(exceptions.handleDBExceptions).toHaveBeenCalledWith(error);
  });

  it('create returns void when successful', async () => {
    (model.create as jest.Mock).mockResolvedValue(undefined);
    await expect(service.create({} as CreateAuditLogDto)).resolves.toBeUndefined();
  });
});
