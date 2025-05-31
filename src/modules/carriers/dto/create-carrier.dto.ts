// Purpose: DTO for carrier creation with validation rules

//* NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Matches } from 'class-validator';

/**
 * Data transfer object for creating a carrier
 * @export
 * @class CreateCarrierDto
 * @example
 * {
 * "dni": "12345678A",
 * "licenseNumber": "B-123456",
 *  }
 */
export class CreateCarrierDto {
  @ApiProperty({
    description: 'Carrier DNI',
    example: '12345678A',
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
}
