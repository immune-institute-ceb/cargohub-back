// Purpose: Define a DTO for updating client information with partial properties
import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
