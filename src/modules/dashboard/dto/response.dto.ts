import { ApiProperty } from '@nestjs/swagger';

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
