import { CarrierStatus } from '@modules/carriers/interfaces/carrier-status.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
export type FinalCarrierStatus = Extract<
  CarrierStatus,
  'resting' | 'available'
>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [CarrierStatus.resting, CarrierStatus.available],
    example: 'done',
  })
  @IsEnum([CarrierStatus.resting, CarrierStatus.available])
  status: FinalCarrierStatus;
}
