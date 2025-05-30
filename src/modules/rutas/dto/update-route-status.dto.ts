import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RouteStatus } from '../interfaces/route-status.interface';

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
