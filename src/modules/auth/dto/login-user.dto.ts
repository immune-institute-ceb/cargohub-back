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
 *  "password": "Password123",
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
      'User password, must have a Uppercase, lowercase letter and a number',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
