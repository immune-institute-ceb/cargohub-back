import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TruckStatus } from '../interfaces/truck-status.interface';

export type FinalTruckStatus = Extract<TruckStatus, 'maintenance'>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [TruckStatus.maintenance],
    example: 'maintenance',
  })
  @IsEnum([TruckStatus.maintenance])
  status: FinalTruckStatus;
}
