import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for verifying two-factor authentication
 * @export
 * @class TwoFactorDto
 * @example
 * {
 *  "token": "123456"
 * }
 * @description This DTO is used to verify the two-factor authentication code sent to the user.
 **/
export class TwoFactorDto {
  @ApiProperty({
    description: '2FA code',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @IsNotEmpty()
  token: string;
}
