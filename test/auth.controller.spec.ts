// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthController } from '../src/modules/auth/auth.controller';
// import AuthService from '../src/modules/auth/auth.service';
// import {
//   RegisterUserDto,
//   LoginUserDto,
//   SetPasswordDto,
// } from '../src/modules/auth/dto';
// import { Request } from 'express';

// describe('AuthController', () => {
//   let controller: AuthController;
//   let service: jest.Mocked<AuthService>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             registerUser: jest.fn(),
//             registerUserAdminManager: jest.fn(),
//             login: jest.fn(),
//             resetPassword: jest.fn(),
//             recoverPassword: jest.fn(),
//             changePassword: jest.fn(),
//             refreshToken: jest.fn(),
//             verifyToken: jest.fn(),
//             generate2faCode: jest.fn(),
//             activateTwoFactorCode: jest.fn(),
//             verify2faCode: jest.fn(),
//             disableTwoFactor: jest.fn(),
//           },
//         },
//       ],
//     }).compile();
//     controller = module.get<AuthController>(AuthController);
//     service = module.get(AuthService);
//   });

//   it('debería estar definido', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('registerUser', () => {
//     it('debería llamar a service.registerUser y devolver el resultado', async () => {
//       const dto: RegisterUserDto = { email: 'test@test.com', phone: '123456789', name: 'Test', lastName1: 'Test', roles: 'client' as any };
//       const result = { message: 'User created, check your email to confirm your account' };
//       service.registerUser.mockResolvedValue(result);
//       expect(await controller.registerUser(dto)).toEqual(result);
//       expect(service.registerUser).toHaveBeenCalledWith(dto);
//     });
//   });

//   describe('loginUser', () => {
//     it('debería llamar a service.login y devolver el resultado', async () => {
//       const dto: LoginUserDto = { email: 'test@test.com', password: 'Password123' };
//       const req = {} as Request;
//       const result = { token: 'jwt-token' };
//       service.login.mockResolvedValue(result);
//       expect(await controller.loginUser(dto, req)).toEqual(result);
//       expect(service.login).toHaveBeenCalledWith(dto, req);
//     });
//   });

//   describe('resetPassword', () => {
//     it('debería llamar a service.resetPassword y devolver el resultado', async () => {
//       const token = 'token';
//       const dto: SetPasswordDto = { password: 'Password123', passwordConfirmed: 'Password123' };
//       const result = { message: 'Password updated' };
//       service.resetPassword.mockResolvedValue(result);
//       expect(await controller.resetPassword(token, dto)).toEqual(result);
//       expect(service.resetPassword).toHaveBeenCalledWith(token, dto);
//     });
//   });
// });
