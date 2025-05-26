// Purpose: DTO for restoring user password.
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

/**
 * Data transfer object for restoring user password
 * @export
 * @class RestoreUserDto
 * @example
 * {
 * "email": "test@gmail.com"
 * }
 */
export class RestoreUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
