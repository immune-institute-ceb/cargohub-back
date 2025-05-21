// Purpose: DTO for recover password.
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

/**
 * Data transfer object for recover password
 * @export
 * @class RecoverPasswordDto
 * @example
 * {
 *  "email": "test@gmail.com"
 * }
 */
export class RecoverPasswordDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsEmail()
  email: string;
}
