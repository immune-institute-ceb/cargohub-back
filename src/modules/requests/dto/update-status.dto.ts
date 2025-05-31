import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../interfaces/request-status.interface';

export type FinalClientStatus = Extract<RequestStatus, 'done'>;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [RequestStatus.done],
    example: 'done',
  })
  @IsEnum([RequestStatus.done])
  status: FinalClientStatus;
}
