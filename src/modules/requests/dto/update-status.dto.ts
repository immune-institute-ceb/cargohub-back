import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../interfaces/request-status.interface';

export type FinalClientStatus = Extract<RequestStatus, 'done' | 'completed'>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [RequestStatus.completed, RequestStatus.done],
    example: 'done',
  })
  @IsEnum([RequestStatus.completed, RequestStatus.done])
  status: FinalClientStatus;
}
