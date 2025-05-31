// Objective: Define a DTO for creating a client with validation and transformation rules.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsString, Matches, MinLength } from 'class-validator';

/**
 * Data transfer object for creating a client
 * @export
 * @class CreateClientDto
 * @example
 * {
 *   "companyName": "Test Company",
 *   "companyCIF": "B12345678",
 *   "companyAddress": "123 Main St, Madrid",
 * }
 */
export class CreateClientDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Test Company',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  companyName: string;

  @ApiProperty({
    description: 'Company CIF',
    example: 'B12345678',
  })
  @IsAlphanumeric()
  @Matches(/^[A-Z]\d{8}$/, {
    message: 'Company CIF must start with a letter followed by 8 digits',
  })
  companyCIF: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Main St, Madrid',
  })
  @IsString()
  @MinLength(1)
  companyAddress: string;
}
