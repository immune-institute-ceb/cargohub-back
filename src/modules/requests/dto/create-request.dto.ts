// Objective: Define a DTO for creating a Request with validation and transformation rules.
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

//*Interfaces
import { RequestPriority } from '../interfaces/request-priority.interface';
import { RequestStatus } from '../interfaces/request-status.interface';

/**
 * Data transfer object for creating a request
 * @export
 * @class CreateRequestDto
 * @example
 * {
 *   "client_name": "ABC Company",
 *   "origin": "Madrid",
 *   "destination": "Barcelona",
 *   "request_date": "2023-08-15T10:30:00Z",
 *   "delivery_date": "2023-08-20T14:00:00Z",
 *   "status": "delivered",
 *   "priority": "high"
 * }
 */
export class CreateRequestDto {
  @ApiProperty({
    description: 'Client name',
    example: 'ABC Company',
  })
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @ApiProperty({
    description: 'Origin of the shipment',
    example: 'Madrid',
  })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({
    description: 'Destination of the shipment',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    description: 'Request date',
    example: '2023-08-15T10:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  request_date: Date;

  @ApiProperty({
    description: 'Estimated delivery date',
    example: '2023-08-20T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  delivery_date?: Date;

  @ApiProperty({
    description: 'Request status',
    example: 'pending',
    enum: RequestStatus,
    default: RequestStatus.pending,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Request priority',
    example: 'high',
    enum: RequestPriority,
    default: RequestPriority.medium,
  })
  @IsString()
  @IsOptional()
  priority?: string;
}
