import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';

describe('AuditLogsController', () => {
  let controller: AuditLogsController;
  let service: jest.Mocked<Pick<AuditLogsService, 'findAll'>>;

  beforeEach(() => {
    service = { findAll: jest.fn() };
    controller = new AuditLogsController(service as unknown as AuditLogsService);
  });

  it('findAll calls service', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('controller is defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns service result', () => {
    service.findAll.mockReturnValue(['a'] as unknown as Awaited<ReturnType<AuditLogsService['findAll']>>);
    expect(controller.findAll()).toEqual(['a']);
  });

  it('propagates errors from service', () => {
    service.findAll.mockImplementation(() => {
      throw new Error('fail');
    });
    expect(() => controller.findAll()).toThrow('fail');
  });

  it('calls service once', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});
