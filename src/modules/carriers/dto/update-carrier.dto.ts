// Purpose: Define a DTO for updating carrier information with partial properties
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCarrierDto } from './create-carrier.dto';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCarrierDto extends PartialType(CreateCarrierDto) {
  @ApiProperty({ description: 'User name', example: 'Test' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'User lastName1', example: 'Example' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  lastName1?: string;

  @ApiPropertyOptional({ description: 'User lastName2', example: 'Api' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsString()
  @IsOptional()
  lastName2?: string;
}
