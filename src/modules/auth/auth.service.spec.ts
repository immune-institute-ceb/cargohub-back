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
    jwt = {
      sign: jest.fn(),
      verifyAsync: jest.fn(),
      signAsync: jest.fn(),
    } as jest.Mocked<JwtService>;
    users = {
      findUserWithPassword: jest.fn(),
      findUserById: jest.fn(),
    } as jest.Mocked<UsersService>;
    exceptions = { handleDBExceptions: jest.fn() } as jest.Mocked<ExceptionsService>;
    audits = {} as jest.Mocked<AuditLogsService>;
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
    } as unknown as ReturnType<typeof users.findUserWithPassword> extends Promise<infer U>
      ? U
      : never;
    jwt.sign.mockReturnValue('token');
    await service.login({ email: 'e', password: 'a' } as LoginUserDto, {} as Request);
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
    });
    expect(result).toEqual({ token: 't' });
  });

  it('verifyToken checks user existence', async () => {
    jwt.verifyAsync.mockResolvedValue({ _id: '1' } as { _id: string });
    users.findUserById.mockResolvedValue({ roles: [] } as unknown as Parameters<typeof service['verifyToken']>[0]);
    await service.verifyToken('tok');
    expect(jwt.verifyAsync).toHaveBeenCalledWith('tok', { secret: expect.any(String) });
    expect(users.findUserById).toHaveBeenCalledWith('1');
  });

  it('getJwtToken delegates to JwtService', () => {
    jwt.sign.mockReturnValue('x');
    const token = (service as unknown as {
      getJwtToken(payload: Record<string, unknown>, exp: string): string;
    }).getJwtToken({ a: 1 }, '1h');
    expect(jwt.sign).toHaveBeenCalledWith({ a: 1 }, { expiresIn: '1h' });
    expect(token).toBe('x');
  });
});
