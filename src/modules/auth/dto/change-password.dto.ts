// Objective: DTO to change the user password, with validation rules
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object to change the user password
 * @export
 * @class ChangePasswordDto
 * @example
 * {
 *  "password": "Password123",
 * "passwordConfirmed": "Password123"
 * }
 */
export class ChangePasswordDto {
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

  @ApiProperty({
    description:
      'User confirm password, must have a Uppercase, lowercase letter and a number',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The passwordConfirmed must have a Uppercase, lowercase letter and a number',
  })
  passwordConfirmed: string;
}
