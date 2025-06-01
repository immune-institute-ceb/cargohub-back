// Objective: Define a DTO for updating the status of a request

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

// * Interfaces
import { RequestStatus } from '../interfaces';

export type FinalClientStatus = Extract<RequestStatus, 'done' | 'cancelled'>;

/**
 * Data transfer object for updating the status of a request
 * @export
 * @class UpdateStatusDto
 * @example
 * {
 *   "status": "done"
 * }
 */
export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [RequestStatus.done, RequestStatus.cancelled],
    example: 'done',
  })
  @IsEnum([RequestStatus.done, RequestStatus.cancelled])
  status: FinalClientStatus;
}
