// Objective: Define a DTO for updating the truck with validation and transformation rules.

// * NestJS modules
import { PartialType } from '@nestjs/swagger';
import { CreateTruckDto } from './create-truck.dto';

export class UpdateTruckDto extends PartialType(CreateTruckDto) {}
