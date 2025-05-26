// Purpose: Define a DTO for updating carrier information with partial properties
import { PartialType } from '@nestjs/swagger';
import { CreateCarrierDto } from './create-carrier.dto';

export class UpdateCarrierDto extends PartialType(CreateCarrierDto) {}
