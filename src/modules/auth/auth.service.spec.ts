import { JwtService } from '@nestjs/jwt';
import AuthService from './auth.service';
import { UsersService } from '../users/users.service';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: jest.Mocked<JwtService>;
  let users: jest.Mocked<UsersService>;
  let exceptions: jest.Mocked<ExceptionsService>;
  let audits: jest.Mocked<AuditLogsService>;

  beforeEach(() => {
    jwt = { sign: jest.fn(), verifyAsync: jest.fn(), signAsync: jest.fn() } as any;
    users = {
      findUserWithPassword: jest.fn(),
      findUserById: jest.fn(),
    } as any;
    exceptions = { handleDBExceptions: jest.fn() } as any;
    audits = {} as any;
    service = new AuthService(jwt, users, exceptions, audits);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login uses UsersService', async () => {
    users.findUserWithPassword.mockResolvedValue({
      _id: '1',
      name: 'n',
      phone: 'p',
      email: 'e',
      roles: [],
      permissions: [],
      toObject: () => ({ password: 'a' }),
      password: 'a',
      twoFactorAuthEnabled: false,
      isActive: true,
      emailVerified: true,
    } as any);
    jwt.sign.mockReturnValue('token');
    await service.login({ email: 'e', password: 'a' } as any, {} as any);
    expect(users.findUserWithPassword).toHaveBeenCalledWith('e');
  });

  it('refreshToken returns signed token', () => {
    jwt.sign.mockReturnValue('t');
    const result = service.refreshToken({
      _id: '1',
      name: 'n',
      phone: 'p',
      email: 'e',
      roles: [],
      permissions: [],
    } as any);
    expect(result).toEqual({ token: 't' });
  });

  it('verifyToken checks user existence', async () => {
    jwt.verifyAsync.mockResolvedValue({ _id: '1' } as any);
    users.findUserById.mockResolvedValue({ roles: [] } as any);
    await service.verifyToken('tok');
    expect(jwt.verifyAsync).toHaveBeenCalledWith('tok', { secret: expect.any(String) });
    expect(users.findUserById).toHaveBeenCalledWith('1');
  });

  it('getJwtToken delegates to JwtService', () => {
    jwt.sign.mockReturnValue('x');
    const token = (service as any).getJwtToken({ a: 1 } as any, '1h');
    expect(jwt.sign).toHaveBeenCalledWith({ a: 1 }, { expiresIn: '1h' });
    expect(token).toBe('x');
  });
});
