// import { Test, TestingModule } from '@nestjs/testing';
// import AuthService from '../src/modules/auth/auth.service';
// import { UsersService } from '../src/modules/users/users.service';
// import { AuditLogsService } from '../src/modules/audit-logs/audit-logs.service';
// import { ExceptionsService } from '../src/common/exceptions/exceptions.service';
// import { JwtService } from '@nestjs/jwt';
// import {
//   RegisterUserDto,
//   LoginUserDto,
//   SetPasswordDto,
// } from '../src/modules/auth/dto';
// import {
//   BadRequestException,
//   UnauthorizedException,
//   NotFoundException,
// } from '@nestjs/common';

// describe('AuthService', () => {
//   let service: AuthService;
//   let usersService: jest.Mocked<UsersService>;
//   let auditLogsService: jest.Mocked<AuditLogsService>;
//   let exceptionsService: jest.Mocked<ExceptionsService>;
//   let jwtService: jest.Mocked<JwtService>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: UsersService, useValue: { create: jest.fn(), findUserWithPassword: jest.fn(), findUserById: jest.fn(), findAndUpdatePassword: jest.fn(), findUserByEmail: jest.fn() } },
//         { provide: AuditLogsService, useValue: { create: jest.fn() } },
//         { provide: ExceptionsService, useValue: { handleDBExceptions: jest.fn() } },
//         { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn(), verifyAsync: jest.fn() } },
//       ],
//     }).compile();
//     service = module.get<AuthService>(AuthService);
//     usersService = module.get(UsersService);
//     auditLogsService = module.get(AuditLogsService);
//     exceptionsService = module.get(ExceptionsService);
//     jwtService = module.get(JwtService);
//   });

//   it('debería estar definido', () => {
//     expect(service).toBeDefined();
//   });

//   describe('registerUser', () => {
//     it('debería crear un usuario y enviar email de confirmación', async () => {
//       const dto: RegisterUserDto = { email: 'test@test.com', phone: '123456789', name: 'Test', lastName1: 'Test', roles: 'client' as any };
//       const user = { email: dto.email };
//       usersService.create.mockResolvedValue(user as any);
//       jest.spyOn(service as any, 'sendConfirmationEmail').mockResolvedValue(undefined);
//       const result = await service.registerUser(dto);
//       expect(result).toEqual({ message: 'User created, check your email to confirm your account' });
//       expect(usersService.create).toHaveBeenCalledWith(dto);
//     });
//     it('debería manejar error si no se crea el usuario', async () => {
//       usersService.create.mockResolvedValue(undefined);
//       const dto: RegisterUserDto = { email: 'test@test.com', phone: '123456789', name: 'Test', lastName1: 'Test', roles: 'client' as any };
//       await expect(service.registerUser(dto)).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('login', () => {
//     it('debería lanzar Unauthorized si el usuario no existe', async () => {
//       usersService.findUserWithPassword.mockResolvedValue(undefined);
//       const dto: LoginUserDto = { email: 'test@test.com', password: 'Password123' };
//       await expect(service.login(dto, {} as any)).rejects.toThrow(UnauthorizedException);
//     });
//   });

//   describe('resetPassword', () => {
//     it('debería lanzar NotFound si el usuario no existe', async () => {
//       jwtService.verify.mockReturnValue({ _id: 'id', message: 'reset' });
//       usersService.findUserById.mockResolvedValue(undefined);
//       const dto: SetPasswordDto = { password: 'Password123', passwordConfirmed: 'Password123' };
//       await expect(service.resetPassword('token', dto)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
