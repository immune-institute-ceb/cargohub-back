import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: jest.Mocked<Pick<DashboardService, 'getDashboardSummary'>>;

  beforeEach(() => {
    service = { getDashboardSummary: jest.fn() };
    controller = new DashboardController(service as DashboardService);
  });

  it('getDashboardSummary calls service', () => {
    controller.getDashboardSummary();
    expect(service.getDashboardSummary).toHaveBeenCalled();
  });

  it('controller defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns summary from service', () => {
    service.getDashboardSummary.mockReturnValue('sum' as any);
    expect(controller.getDashboardSummary()).toBe('sum');
  });

  it('propagates service errors', () => {
    service.getDashboardSummary.mockImplementation(() => {
      throw new Error('fail');
    });
    expect(() => controller.getDashboardSummary()).toThrow('fail');
  });

  it('calls service once', () => {
    controller.getDashboardSummary();
    expect(service.getDashboardSummary).toHaveBeenCalledTimes(1);
  });
});
