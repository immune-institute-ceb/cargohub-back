import { validate } from 'class-validator';
import { RegisterUserDto } from '../src/modules/auth/dto/register-user.dto';

describe('RegisterUserDto', () => {
  it('debería validar un registro válido', async () => {
    const dto = new RegisterUserDto();
    dto.email = 'test@test.com';
    dto.phone = '612345678';
    dto.name = 'Test';
    dto.lastName1 = 'Test';
    dto.roles = 'client' as any;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si el email es inválido', async () => {
    const dto = new RegisterUserDto();
    dto.email = 'noemail';
    dto.phone = '612345678';
    dto.name = 'Test';
    dto.lastName1 = 'Test';
    dto.roles = 'client' as any;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
