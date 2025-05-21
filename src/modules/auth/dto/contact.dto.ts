// Objective: Contact data transfer object for contact controller
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object to contact
 * @export
 * @class ContactDto
 * @example
 * {
 *  "name": "Test",
 * "email": "test@gmail.com",
 * "consulta": "123456789"
 * }
 */

export class ContactDto {
  @ApiProperty({
    description: 'User name',
    example: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'User phone',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  readonly consulta: string;
}
