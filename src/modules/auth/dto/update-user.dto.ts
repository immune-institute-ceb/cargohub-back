// Objective: Define a DTO for updating user information with nested client and carrier data

//* NestJS modules
import {
  ApiHideProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

// * DTOs
import { BaseUserFieldsDto } from './base-user-fields.dto';
import { UpdateClientDto } from '@modules/clients/dto/update-client.dto';
import { UpdateCarrierDto } from '@modules/carriers/dto/update-carrier.dto';

// * Interfaces
import { ValidRoles } from '../interfaces';

/**
 * Data transfer object for updating user information with optional client or carrier data
 * @export
 * @class UpdateUserDto
 * @example
 * {
 *  "email": "test@gmail.com",
 *  "phone": "123456789",
 * "name": "Test",
 * "lastName1": "Example",
 * "lastName2": "Api",
 * "roles": "client",
 * "clientData": {
 *    "clientField1": "value1",
 *   "clientField2": "value2"
 * },
 * "carrierData": null
 */
export class UpdateUserDto extends OmitType(BaseUserFieldsDto, [
  'email',
  'roles',
]) {
  @ApiHideProperty()
  @Exclude()
  email?: string;

  @ApiHideProperty()
  @Exclude()
  roles?: ValidRoles[];

  @ValidateNested()
  @Type(() => UpdateClientDto)
  @ApiPropertyOptional({ type: () => UpdateClientDto })
  clientData?: UpdateClientDto;

  @ValidateNested()
  @Type(() => UpdateCarrierDto)
  @ApiPropertyOptional({ type: () => UpdateCarrierDto })
  carrierData?: UpdateCarrierDto;
}
