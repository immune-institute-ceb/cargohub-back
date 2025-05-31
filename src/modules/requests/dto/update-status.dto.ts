import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../interfaces/request-status.interface';

export type FinalClientStatus = Extract<RequestStatus, 'done' | 'cancelled'>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [RequestStatus.done, RequestStatus.cancelled],
    example: 'done',
  })
  @IsEnum([RequestStatus.done, RequestStatus.cancelled])
  status: FinalClientStatus;
}
