// Purpose: DTO for user registration with validation and transformation
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

//* Nested DTOs
import { CreateCarrierDto } from '@modules/carriers/dto/create-carrier.dto';
import { CreateClientDto } from '@modules/clients/dto/create-client.dto';

//* Interfaces
import { ValidRoles } from '../interfaces';

//* Common modules
import { IsRequiredIfRole, RoleDataConsistency } from '@common/validators';

/**
 * Data transfer object for user registration
 * @export
 * @class RegisterUserDto
 * @example
 * {
 * "email": "test@gmail.com"
 * "phone": "123456789",
 * "password": "Password123",
 * "name": "Test",
 * "lastName1": "Example",
 * "lastName2": "Api",
 * "roles": ["client"],
 * ! If the user has the 'client' role, the clientData field is required
 * ! If the user has the 'carrier' role, the carrierData field is required
 * "clientData": {
 *   ... // Client specific data
 * }
 */
export class RegisterUserDto {
  @ApiProperty({ description: 'User email', example: 'test@gmail.com' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User phone', example: '123456789' })
  @IsString()
  @IsPhoneNumber('ES')
  phone: string;

  @ApiProperty({
    description: 'Password must contain uppercase, lowercase, and a number',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain an uppercase letter, a lowercase letter, and a number',
  })
  password: string;

  @ApiProperty({ description: 'User name', example: 'Test' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'User lastName1', example: 'Example' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  lastName1: string;

  @ApiPropertyOptional({ description: 'User lastName2', example: 'Api' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsString()
  @IsOptional()
  lastName2?: string;

  @ApiProperty({
    description: 'User role',
    example: 'client | carrier | admin',
  })
  @IsArray()
  @IsEnum(ValidRoles, {
    each: true,
    message: `roles must be one of the following: ${Object.values(ValidRoles).join(', ')}`,
  })
  roles: ValidRoles[];

  @IsRequiredIfRole(ValidRoles.client)
  @ValidateNested()
  @Type(() => CreateClientDto)
  @ApiPropertyOptional({ type: () => CreateClientDto })
  clientData?: CreateClientDto;

  @IsRequiredIfRole(ValidRoles.carrier)
  @ValidateNested()
  @Type(() => CreateCarrierDto)
  @ApiPropertyOptional({ type: () => CreateCarrierDto })
  carrierData?: CreateCarrierDto;

  // Custom validator to ensure data consistency based on roles
  @RoleDataConsistency()
  private readonly __rolesValidator__: unknown;
}
