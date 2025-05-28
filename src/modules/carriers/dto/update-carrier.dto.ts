// Purpose: Define a DTO for updating carrier information with partial properties
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateCarrierDto } from './create-carrier.dto';
import { Exclude } from 'class-transformer';

export class UpdateCarrierDto extends PartialType(
  OmitType(CreateCarrierDto, ['dni']),
) {
  @ApiHideProperty()
  @Exclude()
  dni?: string;
}
