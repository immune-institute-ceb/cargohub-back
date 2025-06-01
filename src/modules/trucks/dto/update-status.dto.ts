// Objective: Define a DTO for updating the status of a truck with validation and transformation rules.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

// * Interfaces
import { TruckStatus } from '../interfaces/truck-status.interface';

export type FinalTruckStatus = Extract<
  TruckStatus,
  'maintenance' | 'available'
>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [TruckStatus.maintenance, TruckStatus.available],
    example: 'maintenance',
  })
  @IsEnum([TruckStatus.maintenance, TruckStatus.available])
  status: FinalTruckStatus;
}
