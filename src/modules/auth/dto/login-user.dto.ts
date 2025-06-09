// Purpose: DTO for login user endpoint.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for login user
 * @export
 * @class LoginUserDto
 * @example
 * {
 *  "email": "test@gmail.com",
 *  "password": "Password123?",
 *  "twoFactor" : "123456"
 * }
 */
export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'User Password: must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Password123?',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/, {
    message:
      'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
