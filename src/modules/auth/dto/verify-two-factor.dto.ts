// Objective: Define a DTO for verifying two-factor authentication with validation rules

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

/**
 * Data transfer object for verifying two-factor authentication
 * @export
 * @class VerifyTwoFactorDto
 * @example
 * {
 *  "token": "123456",
 * "email": "test@gmail.com"
 * }
 * @description This DTO is used to verify the two-factor authentication code sent to the user.
 */
export class VerifyTwoFactorDto {
  @ApiProperty({
    description: '2FA code',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
