import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { FuelType } from '../interfaces/fuel-type.interface';
import { TruckStatus } from '../interfaces/truck-status.interface';

export class CreateTruckDto {
  @ApiProperty({
    description: 'Truck license plate',
    example: 'ABC-1234',
  })
  @IsString()
  @Matches(/^[A-Z]{3}-\d{4}$/, {
    message: 'licensePlate must be in the format "ABC-1234"',
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
    message: `status must be one of the following: available, in_use, maintenance`,
  })
  status: TruckStatus;
}
