import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { TruckStatus } from '../interfaces/truck-status.interface';

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
