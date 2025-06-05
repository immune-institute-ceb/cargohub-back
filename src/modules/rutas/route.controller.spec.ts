import { RoutesController } from './route.controller';
import { RoutesService } from './route.service';
import { RouteStatus } from './interfaces/route-status.interface';
import { User } from '../users/entities/user.entity';

describe('RoutesController', () => {
  let controller: RoutesController;
  let service: jest.Mocked<Pick<RoutesService,
    'updateRouteStatus' | 'findAllRoutes' | 'findRouteById' | 'findRoutesByStatus' | 'findRoutesByCarrier' | 'assignCarrierToRoute' | 'unassignRouteFromCarrier'>>;

  beforeEach(() => {
    service = {
      updateRouteStatus: jest.fn(),
      findAllRoutes: jest.fn(),
      findRouteById: jest.fn(),
      findRoutesByStatus: jest.fn(),
      findRoutesByCarrier: jest.fn(),
      assignCarrierToRoute: jest.fn(),
      unassignRouteFromCarrier: jest.fn(),
    };
    controller = new RoutesController(service as unknown as RoutesService);
  });

  it('updateStatus calls service', () => {
    const user = {} as unknown as User;
    controller.updateStatus(user, '1', RouteStatus.done);
    expect(service.updateRouteStatus).toHaveBeenCalledWith('1', RouteStatus.done, user);
  });

  it('findAll calls service', () => {
    controller.findAll();
    expect(service.findAllRoutes).toHaveBeenCalled();
  });

  it('findOne calls service', () => {
    controller.findOne('1');
    expect(service.findRouteById).toHaveBeenCalledWith('1');
  });

  it('findRoutesByStatus calls service', () => {
    controller.findRoutesByStatus(RouteStatus.inTransit);
    expect(service.findRoutesByStatus).toHaveBeenCalledWith(RouteStatus.inTransit);
  });

  it('findRoutesByCarrier calls service', () => {
    controller.findRoutesByCarrier('c');
    expect(service.findRoutesByCarrier).toHaveBeenCalledWith('c');
  });

  it('assignCarrierToRoute calls service', () => {
    controller.assignCarrierToRoute('r', 'c');
    expect(service.assignCarrierToRoute).toHaveBeenCalledWith('r', 'c');
  });

  it('unassignRouteFromCarrier calls service', () => {
    controller.unassignRouteFromCarrier('r');
    expect(service.unassignRouteFromCarrier).toHaveBeenCalledWith('r');
  });
});
