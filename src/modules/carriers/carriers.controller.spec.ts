import { CarriersController } from './carriers.controller';
import { CarriersService } from './carriers.service';
import { CarrierStatus } from './interfaces/carrier-status.interface';

describe('CarriersController', () => {
  let controller: CarriersController;
  let service: jest.Mocked<Pick<CarriersService,
    'findAll' | 'findOne' | 'getCarrierRoutes' | 'assignTruck' | 'unassignTruck' | 'updateCarrierStatus'>>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      getCarrierRoutes: jest.fn(),
      assignTruck: jest.fn(),
      unassignTruck: jest.fn(),
      updateCarrierStatus: jest.fn(),
    };
    controller = new CarriersController(service as unknown as CarriersService);
  });

  it('findAll calls service', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne calls service with id', () => {
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('getCarrierRoutes calls service with id', () => {
    controller.getCarrierRoutes('1');
    expect(service.getCarrierRoutes).toHaveBeenCalledWith('1');
  });

  it('assignTruck calls service with ids', () => {
    controller.assignTruck('1','2');
    expect(service.assignTruck).toHaveBeenCalledWith('1','2');
  });

  it('unassignTruck calls service with id', () => {
    controller.unassignTruck('1');
    expect(service.unassignTruck).toHaveBeenCalledWith('1');
  });

  it('updateCarrierStatus calls service with params', () => {
    controller.updateCarrierStatus('1', CarrierStatus.available);
    expect(service.updateCarrierStatus).toHaveBeenCalledWith('1', CarrierStatus.available);
  });
});
