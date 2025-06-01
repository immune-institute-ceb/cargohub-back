// Objective: Define a DTO for updating the status of a route with validation and transformation rules.

// * NestJS modules
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// * Interfaces
import { RouteStatus } from '../interfaces/route-status.interface';

/**
 * Data transfer object for updating the status of a route
 * @export
 * @class UpdateRouteStatusDto
 * @example
 * {
 *  "status": "inTransit"
 *  }
 */
export class UpdateRouteStatusDto {
  @ApiProperty({
    description: 'New status for the route',
    enum: RouteStatus,
    example: RouteStatus.inTransit,
  })
  @IsEnum(RouteStatus, {
    message: `Status must be one of: ${Object.values(RouteStatus).join(', ')}`,
  })
  status: RouteStatus;
}
