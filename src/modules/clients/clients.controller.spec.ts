import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientsStatus } from './interfaces/active-clients.interface';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: jest.Mocked<Pick<ClientsService,
    'findAll' | 'findOne' | 'updateStatus'>>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
    };
    controller = new ClientsController(service as ClientsService);
  });

  it('findAll calls service', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne calls service with id', () => {
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('updateStatus calls service with params', () => {
    controller.updateStatus('1', ClientsStatus.active);
    expect(service.updateStatus).toHaveBeenCalledWith('1', ClientsStatus.active);
  });

  it('controller defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns service result', () => {
    service.findAll.mockReturnValue(['c'] as any);
    expect(controller.findAll()).toEqual(['c']);
  });
});
