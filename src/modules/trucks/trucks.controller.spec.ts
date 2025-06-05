import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { FinalTruckStatus } from './dto/update-status.dto';

describe('TrucksController', () => {
  let controller: TrucksController;
  let service: jest.Mocked<Pick<TrucksService,
    'create' | 'findAll' | 'findOne' | 'update' | 'updateTruckStatus' | 'remove'>>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateTruckStatus: jest.fn(),
      remove: jest.fn(),
    };
    controller = new TrucksController(service as unknown as TrucksService);
  });

  it('create calls service', () => {
    controller.create({} as unknown as import('./dto/create-truck.dto').CreateTruckDto);
    expect(service.create).toHaveBeenCalled();
  });

  it('findAll calls service', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne calls service with id', () => {
    controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('update calls service with params', () => {
    const dto = {} as unknown as import('./dto/update-truck.dto').UpdateTruckDto;
    controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('updateStatus calls service with params', () => {
    controller.updateStatus('1', 'maintenance' as FinalTruckStatus);
    expect(service.updateTruckStatus).toHaveBeenCalledWith('1', 'maintenance');
  });

  it('remove calls service with id', () => {
    controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
