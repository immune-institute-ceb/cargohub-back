// update-user.dto.ts
import {
  ApiHideProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { BaseUserFieldsDto } from './base-user-fields.dto';
import { UpdateClientDto } from '@modules/clients/dto/update-client.dto';
import { UpdateCarrierDto } from '@modules/carriers/dto/update-carrier.dto';
import { ValidRoles } from '../interfaces';

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
