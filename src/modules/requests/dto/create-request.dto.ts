// Objective: Define a DTO for creating a Request with validatio

//* NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';

// * Validators
import { IsCity } from '@common/validators';
import { RequestPackageType, RequestPriority } from '../interfaces';

/**
 * Data transfer object for creating a request
 * @export
 * @class CreateRequestDto
 * @example
 * {
 *   "client_name": "ABC Company",
 *   "origin": "Madrid",
 *   "destination": "Barcelona",
 *  "packageType": "box",
 *  "priority": "high",
 *  "packageWeight": 10,
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
  @IsCity({
    message: 'Origin must be a valid city',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  origin: string;

  @ApiProperty({
    description: 'Destination of the shipment',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  @IsCity({
    message: 'Destination must be a valid city',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  destination: string;

  @ApiProperty({
    description: 'Package weight in kg',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  packageWeight: number;

  @ApiProperty({
    description: 'Request package type',
    example: RequestPackageType.box,
  })
  @IsString()
  @IsEnum(RequestPackageType, {
    each: true,
    message: `Package type must be one of the following: ${Object.values(RequestPackageType).join(', ')}`,
  })
  @IsNotEmpty()
  packageType: string;

  @ApiProperty({
    description: 'Request priority',
    example: RequestPriority.medium,
  })
  @IsString()
  @IsEnum(RequestPriority, {
    each: true,
    message: `Priority must be one of the following: ${Object.values(RequestPriority).join(', ')}`,
  })
  @IsNotEmpty()
  priority: string;
}
