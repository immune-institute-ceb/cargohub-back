// Objective: Define a DTO for creating a Truck with validation and transformation rules.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

// * Interfaces
import { FuelType } from '../interfaces/fuel-type.interface';
import { TruckStatus } from '../interfaces/truck-status.interface';

/**
 * Data transfer object for creating a Truck
 * @export
 * @class CreateTruckDto
 * @example
 * {
 *   "licensePlate": "ABC-1234",
 *  "carModel": "Ford F-150",
 *  "capacity": 5,
 * "fuelType": "diesel",
 * "status": "available"
 *  }
 */
export class CreateTruckDto {
  @ApiProperty({
    description: 'Truck license plate',
    example: 'ABC-1234',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=(?:[^ ]* ){0,3}[^ ]*$)[A-Z0-9 ]+$/, {
    message:
      'licensePlate must contain only uppercase letters, numbers, and up to 3 spaces',
  })
  licensePlate: string;

  @ApiProperty({
    description: 'Truck model',
    example: 'Ford F-150',
  })
  @IsString()
  @IsNotEmpty()
  carModel: string;

  @ApiProperty({
    description: 'Truck capacity in tons',
    example: 5,
  })
  @IsNumber()
  @Min(1, {
    message: 'capacity must be at least 1 ton',
  })
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({
    description: 'Fuel type of the truck',
    example: 'diesel',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(FuelType, {
    each: true,
    message: `fuelType must be one of the following: ${Object.values(FuelType).join(', ')}`,
  })
  fuelType: FuelType;

  @ApiProperty({
    description: 'Truck status',
    example: 'available',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(TruckStatus, {
    each: true,
    message: `status must be one of the following: ${Object.values(TruckStatus).join(', ')}`,
  })
  status: TruckStatus;
}
