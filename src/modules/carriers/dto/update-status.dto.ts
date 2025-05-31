// Objective: Define a DTO for updating the status of a carrier request

//* NestJS modules
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// * Interfaces
import { CarrierStatus } from '@modules/carriers/interfaces/carrier-status.interface';

/**
 * Enum representing the possible statuses of a carrier request.
 * @enum {string}
 */
export type FinalCarrierStatus = Extract<
  CarrierStatus,
  'resting' | 'available'
>;

/**
 * DTO for updating the status of a carrier request.
 * @export
 * @class UpdateStatusDto
 * @example
 * {
 *  "status": "available"
 * }
 */
export class UpdateStatusDto {
  @ApiProperty({
    description: 'New status for the request',
    enum: [CarrierStatus.resting, CarrierStatus.available],
    example: 'done',
  })
  @IsEnum([CarrierStatus.resting, CarrierStatus.available])
  status: FinalCarrierStatus;
}
