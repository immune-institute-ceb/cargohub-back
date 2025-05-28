// base-user-fields.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidRoles } from '../interfaces';

export class BaseUserFieldsDto {
  @ApiPropertyOptional({ description: 'User email', example: 'test@gmail.com' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone', example: '123456789' })
  @IsPhoneNumber('ES')
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'User name', example: 'Test' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'User lastName1', example: 'Example' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsString()
  @MinLength(1)
  @IsOptional()
  lastName1?: string;

  @ApiPropertyOptional({ description: 'User lastName2', example: 'Api' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsString()
  @IsOptional()
  lastName2?: string;

  @ApiPropertyOptional({ description: 'User role', example: ['client'] })
  @IsArray()
  @IsEnum(ValidRoles, {
    each: true,
    message: `roles must be one of: ${Object.values(ValidRoles).join(', ')}`,
  })
  @IsOptional()
  roles?: ValidRoles[];
}
