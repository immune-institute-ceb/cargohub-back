// register-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseUserFieldsDto } from './base-user-fields.dto';
import { CreateClientDto } from '@modules/clients/dto/create-client.dto';
import { CreateCarrierDto } from '@modules/carriers/dto/create-carrier.dto';
import { IsRequiredIfRole, RoleDataConsistency } from '@common/validators';
import { ValidRoles } from '../interfaces';

export class RegisterUserDto extends BaseUserFieldsDto {
  @ApiProperty({ description: 'User email', example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ description: 'User phone', example: '123456789' })
  phone: string;

  @ApiProperty({ description: 'User name', example: 'Test' })
  name: string;

  @ApiProperty({ description: 'User lastName1', example: 'Example' })
  lastName1: string;

  @ApiPropertyOptional({ description: 'User lastName2', example: 'Api' })
  lastName2?: string;

  @ApiProperty({
    description: 'User roles',
    example: ['client'],
    enum: ValidRoles,
  })
  roles: ValidRoles;

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

  @RoleDataConsistency()
  private readonly __rolesValidator__: unknown;
}
