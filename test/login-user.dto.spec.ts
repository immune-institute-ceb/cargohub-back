// import { validate } from 'class-validator';
// import { LoginUserDto } from '../src/modules/auth/dto/login-user.dto';

// describe('LoginUserDto', () => {
//   it('debería validar un email y password válidos', async () => {
//     const dto = new LoginUserDto();
//     dto.email = 'test@test.com';
//     dto.password = 'Password123';
//     const errors = await validate(dto);
//     expect(errors.length).toBe(0);
//   });

//   it('debería fallar si el email es inválido', async () => {
//     const dto = new LoginUserDto();
//     dto.email = 'noemail';
//     dto.password = 'Password123';
//     const errors = await validate(dto);
//     expect(errors.length).toBeGreaterThan(0);
//   });

//   it('debería fallar si el password no cumple requisitos', async () => {
//     const dto = new LoginUserDto();
//     dto.email = 'test@test.com';
//     dto.password = 'abc';
//     const errors = await validate(dto);
//     expect(errors.length).toBeGreaterThan(0);
//   });
// });
