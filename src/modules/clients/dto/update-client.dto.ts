// Purpose: Define a DTO for updating client information with partial properties

// * NestJS modules
import { Exclude } from 'class-transformer';
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';

// * DTOs
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(
  OmitType(CreateClientDto, ['companyCIF']),
) {
  @ApiHideProperty()
  @Exclude()
  companyCIF?: string;
}
