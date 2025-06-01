// Objective: Define the Truck entity schema for MongoDB using Mongoose in a NestJS application.

// * NestJS modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

// * External modules
import { Document, Types } from 'mongoose';

// * Interfaces
import { TruckStatus } from '../interfaces/truck-status.interface';

/**
 * Truck entity schema
 * @param _id Truck id
 * @param licensePlate Truck license plate
 * @param carModel Truck model
 * @param capacity Truck capacity in tons
 * @param fuelType Fuel type of the truck
 * @param status Truck status (available, inMaintenance, unavailable)
 * @returns Truck entity schema
 */
@Schema({ timestamps: true })
export class Truck extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Truck license plate',
    example: 'ABC-1234',
  })
  @Prop({
    index: true,
    unique: true,
  })
  licensePlate: string;

  @ApiProperty({
    description: 'Truck model',
    example: 'Ford F-150',
  })
  @Prop({
    index: true,
    required: true,
  })
  carModel: string;

  @ApiProperty({
    description: 'Truck capacity in tons',
    example: 5,
  })
  @Prop({
    index: true,
    required: true,
  })
  capacity: number;

  @ApiProperty({
    description: 'Fuel type of the truck',
    example: 'diesel',
  })
  @Prop({
    index: true,
    required: true,
  })
  fuelType: string;

  @ApiProperty({
    description: 'Truck status',
    example: TruckStatus.available,
  })
  @Prop({
    index: true,
    enum: TruckStatus,
    default: TruckStatus.available,
  })
  status: TruckStatus;
}

export const TruckSchema = SchemaFactory.createForClass(Truck);
