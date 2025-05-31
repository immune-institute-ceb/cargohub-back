// Objective : Define a DTO for base user fields with validation rules

//* NestJS modules
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

// * Interfaces
import { ValidRoles } from '../interfaces';

/**
 * Base user fields data transfer object
 * @export
 * @class BaseUserFieldsDto
 * @example
 * {
 *  "email": "test@gmail.com"
 * "phone": "123456789",
 * "name": "Test",
 * "lastName1": "Example",
 * "lastName2": "Api",
 * "roles": ["client"]
 * }
 */
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
  @IsEnum([ValidRoles.client, ValidRoles.carrier], {
    each: true,
    message: 'Invalid role provided',
  })
  @IsOptional()
  roles?: ValidRoles;
}
