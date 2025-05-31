// Purpose: Define a DTO for updating client information with partial properties

// * NestJS modules
import { PartialType } from '@nestjs/swagger';

// * DTOs
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
