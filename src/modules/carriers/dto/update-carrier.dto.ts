// Purpose: Define a DTO for updating carrier information with partial properties

// * NestJS modules
import { Exclude } from 'class-transformer';
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';

// * DTOs
import { CreateCarrierDto } from './create-carrier.dto';

export class UpdateCarrierDto extends PartialType(
  OmitType(CreateCarrierDto, ['dni']),
) {
  @ApiHideProperty()
  @Exclude()
  dni?: string;
}
