import { AuthController } from './auth.controller';
import AuthService from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<Pick<AuthService,
    'registerUser' | 'login' | 'refreshToken' | 'disableTwoFactor' | 'verifyToken'>>;

  beforeEach(() => {
    service = {
      registerUser: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      disableTwoFactor: jest.fn(),
      verifyToken: jest.fn(),
    } as unknown as jest.Mocked<Pick<AuthService,
      'registerUser' | 'login' | 'refreshToken' | 'disableTwoFactor' | 'verifyToken'>>;
    controller = new AuthController(service as unknown as AuthService);
  });

  it('registerUser calls service', () => {
    controller.registerUser({} as unknown as RegisterUserDto);
    expect(service.registerUser).toHaveBeenCalled();
  });

  it('loginUser calls service', () => {
    const req = {} as unknown as Request;
    const dto = {} as unknown as LoginUserDto;
    controller.loginUser(dto, req);
    expect(service.login).toHaveBeenCalledWith(dto, req);
  });

  it('refreshTokenUser calls service', () => {
    const user = {} as unknown as User;
    controller.refreshTokenUser(user);
    expect(service.refreshToken).toHaveBeenCalledWith(user);
  });

  it('disableTwoFactor calls service', () => {
    const user = {} as unknown as User;
    controller.disableTwoFactor(user);
    expect(service.disableTwoFactor).toHaveBeenCalledWith(user);
  });

  it('verifyTokenSessionUser calls service', () => {
    controller.verifyTokenSessionUser('tok');
    expect(service.verifyToken).toHaveBeenCalledWith('tok');
  });
});
