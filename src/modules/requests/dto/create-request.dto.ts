// Objective: Define a DTO for creating a Request with validation and transformation rules.
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';

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
    description: 'Origin of the shipment',
    example: 'Madrid',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  origin: string;

  @ApiProperty({
    description: 'Destination of the shipment',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
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
    default: RequestStatus.pending,
  })
  @IsString()
  @IsOptional()
  @IsEnum(RequestStatus, {
    each: true,
    message: `status must be one of: ${Object.values(RequestStatus).join(', ')}`,
  })
  status?: RequestStatus[];

  @ApiProperty({
    description: 'Request priority',
    example: 'high',
    default: RequestPriority.medium,
  })
  @IsString()
  @IsOptional()
  @IsEnum(RequestPriority, {
    each: true,
    message: `priority must be one of: ${Object.values(RequestPriority).join(', ')}`,
  })
  priority?: RequestPriority[];
}
