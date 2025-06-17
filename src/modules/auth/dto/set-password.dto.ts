// Objective: DTO to change the user password, with validation rules

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object to change the user password
 * @export
 * @class SetPasswordDto
 * @example
 * {
 *  "password": "Password123?",
 * "passwordConfirmed": "Password123?"
 * }
 */
export class SetPasswordDto {
  @ApiProperty({
    description:
      'User password, must have at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
    example: 'Password123?',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/, {
    message:
      'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
  })
  password: string;

  @ApiProperty({
    description:
      'User confirm password, must have at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
    example: 'Password123?',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  passwordConfirmed: string;
}
