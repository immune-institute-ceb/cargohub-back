import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { FinalClientStatus } from './dto/update-status.dto';

import { User } from '../users/entities/user.entity';

describe('RequestsController', () => {
  let controller: RequestsController;
  let service: jest.Mocked<Pick<RequestsService,
    'create' | 'findAllRequestsByClientId' | 'findOne' | 'updateStatus' | 'remove'>>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAllRequestsByClientId: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
    };
    controller = new RequestsController(service as RequestsService);
  });

  it('create calls service', () => {
    const user = {} as unknown as User;
    controller.create({} as unknown as import('./dto/create-request.dto').CreateRequestDto, user);
    expect(service.create).toHaveBeenCalledWith(expect.anything(), user);
  });

  it('findAllRequestsByClientId calls service', () => {
    controller.findAllRequestsByClientId('1');
    expect(service.findAllRequestsByClientId).toHaveBeenCalledWith('1');
  });

  it('findOne calls service with id', () => {
    controller.findOne('2');
    expect(service.findOne).toHaveBeenCalledWith('2');
  });

  it('updateStatus calls service with parameters', () => {
    const user = {} as unknown as User;
    controller.updateStatus(user, '2', 'done' as FinalClientStatus);
    expect(service.updateStatus).toHaveBeenCalledWith('2', 'done', user);
  });

  it('remove calls service with id', () => {
    controller.remove('3');
    expect(service.remove).toHaveBeenCalledWith('3');
  });
});
