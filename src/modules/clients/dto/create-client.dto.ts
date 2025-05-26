import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

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

  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
