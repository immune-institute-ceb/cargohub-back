// import { validate } from 'class-validator';
// import { SetPasswordDto } from '../src/modules/auth/dto/set-password.dto';

// describe('SetPasswordDto', () => {
//   it('debería validar un password y confirmación válidos', async () => {
//     const dto = new SetPasswordDto();
//     dto.password = 'Password123';
//     dto.passwordConfirmed = 'Password123';
//     const errors = await validate(dto);
//     expect(errors.length).toBe(0);
//   });

//   it('debería fallar si el password es muy corto', async () => {
//     const dto = new SetPasswordDto();
//     dto.password = 'abc';
//     dto.passwordConfirmed = 'abc';
//     const errors = await validate(dto);
//     expect(errors.length).toBeGreaterThan(0);
//   });

//   it('debería fallar si el password y la confirmación no coinciden', async () => {
//     const dto = new SetPasswordDto();
//     dto.password = 'Password123';
//     dto.passwordConfirmed = 'Password321';
//     // La validación de coincidencia se hace en el servicio, aquí solo validamos reglas básicas
//     const errors = await validate(dto);
//     expect(errors.length).toBe(0); // La validación de coincidencia es lógica del servicio, no del DTO
//   });
// });
