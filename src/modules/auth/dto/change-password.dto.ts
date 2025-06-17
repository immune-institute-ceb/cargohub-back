// Objective: DTO to change the user authenticated password, with validation rules

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object to change the user password
 * @export
 * @class ChangePasswordDto
 * @example
 * {
 * "oldPassword": "OldPassword123",
 *  "password": "Password123?",
 * "passwordConfirmed": "Password123?"
 * }
 */
export class ChangePasswordDto {
  @ApiProperty({
    description: 'User old password',
    example: 'OldPassword123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  oldPassword: string;

  @ApiProperty({
    description:
      'User password, must have at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
    example: 'Password123?',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?!.*_)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
    message:
      'The newPassword must include at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
  })
  newPassword: string;

  @ApiProperty({
    description:
      'User confirm password, must have at least one uppercase letter, one lowercase letter, one number, and one special character (_ not included).',
    example: 'Password123?',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPasswordConfirmed: string;
}
