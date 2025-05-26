// Purpose: DTO for carrier creation with validation rules
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

/**
 * Data transfer object for creating a carrier
 * @export
 * @class CreateCarrierDto
 * @example
 * {
 * "dni": "12345678A",
 * "licenseNumber": "B-123456",
 * "userId": "5f4e6d6f4f6d4f6d4f6d4f6d"
 * }
 */
export class CreateCarrierDto {
  @ApiProperty({
    description: 'Carrier DNI',
    example: '123456789A',
  })
  @IsAlphanumeric()
  @Matches(/^\d{8}[A-Z]$/, {
    message: 'DNI must be 8 digits followed by a letter',
  })
  dni: string;

  @ApiProperty({
    description: 'Carrier license number',
    example: 'B-123456',
  })
  @Matches(/^[A-Z]-\d{6}$/, {
    message: 'License number must be a letter followed by a dash and 6 digits',
  })
  licenseNumber: string;

  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
