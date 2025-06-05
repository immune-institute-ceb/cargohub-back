import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserWithRelations } from './interfaces/user-with-relations';
import { UpdateUserDto } from '@modules/auth/dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<Pick<UsersService,
    'getUser' | 'update' | 'deleteUser' | 'deleteUserByAdmin'>>;

  beforeEach(() => {
    service = {
      getUser: jest.fn(),
      update: jest.fn(),
      deleteUser: jest.fn(),
      deleteUserByAdmin: jest.fn(),
    };
    controller = new UsersController(service as UsersService);
  });

  it('getUser calls service', () => {
    const user = {} as unknown as UserWithRelations;
    controller.getUser(user);
    expect(service.getUser).toHaveBeenCalledWith(user);
  });

  it('update calls service with params', () => {
    const user = {} as unknown as UserWithRelations;
    const dto = {} as unknown as UpdateUserDto;
    controller.update(dto, user);
    expect(service.update).toHaveBeenCalledWith(user, dto);
  });

  it('deleteUser calls service', () => {
    const user = {} as unknown as UserWithRelations;
    controller.deleteUser(user);
    expect(service.deleteUser).toHaveBeenCalledWith(user);
  });

  it('deleteUserByAdmin calls service', () => {
    controller.deleteUserByAdmin('1');
    expect(service.deleteUserByAdmin).toHaveBeenCalledWith('1');
  });

  it('controller defined', () => {
    expect(controller).toBeDefined();
  });
});
