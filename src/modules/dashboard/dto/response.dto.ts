// Objective: Define a DTO for Dashboard response with monthly request statistics and other metrics.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';

// MonthlyRequestsDto class to encapsulate monthly request statistics
class MonthlyRequestsDto {
  @ApiProperty({
    description: 'Monthly completed requests',
    type: [Number],
    example: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  })
  completed: number[];

  @ApiProperty({
    description: 'Monthly pending requests',
    type: [Number],
    example: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  })
  pending: number[];
}

/**
 * Data Transfer Object for Dashboard Response
 * @export
 * @class DashboardResponseDto
 * @description This DTO encapsulates the response structure for the dashboard, including metrics such as active clients, carriers, active routes, monthly requests, and request status.
 * @example
 * {
 *  "activeClients": 1,
 * "carriers": 5,
 * "activeRoutes": 10,
 * "monthlyRequests": {
 *    "completed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
 *   "pending": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
 * },
 */
export class DashboardResponseDto {
  @ApiProperty({
    description: 'Total number of requests',
    type: Number,
    example: 1,
  })
  activeClients: number;

  @ApiProperty({
    description: 'Total number of carriers',
    type: Number,
    example: 5,
  })
  carriers: number;

  @ApiProperty({
    description: 'Total number of active routes',
    type: Number,
    example: 10,
  })
  activeRoutes: number;

  @ApiProperty({
    description: 'Monthly request statistics',
    type: MonthlyRequestsDto,
  })
  monthlyRequests: MonthlyRequestsDto;

  @ApiProperty({
    description: 'Total number of requests',
    type: Number,
    example: 2000,
  })
  requestsStatus: {
    pending: number;
    completed: number;
    cancelled: number;
    inTransit: number;
  };
}
