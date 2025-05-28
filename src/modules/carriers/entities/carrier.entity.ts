// Purpose: Define the carrier entity schema and model for the database
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';
import { CarrierStatus } from '../interfaces/carrier-status.interface';

/**
 * Carrier entity schema
 * @param _id Carrier id
 * @param dni Carrier DNI
 * @param licenseNumber Carrier license number
 * @param userId User id associated with the carrier
 * @export
 * @class Carrier
 */
@Schema({ timestamps: true })
export class Carrier extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Carrier DNI',
    example: '123456789A',
  })
  @Prop({
    index: true,
    unique: true,
  })
  dni: string;

  @ApiProperty({
    description: 'Carrier license number',
    example: 'B-123456',
  })
  @Prop({
    index: true,
    unique: true,
  })
  licenseNumber: string;

  @ApiProperty({
    description: 'Client status',
    example: CarrierStatus.available,
  })
  @Prop({
    index: true,
    enum: CarrierStatus,
    default: CarrierStatus.available,
  })
  status: CarrierStatus;

  @ApiProperty({
    description: 'User id',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
    },
    type: 'string',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  user?: Types.ObjectId | null;

  @ApiProperty({
    description: 'Truck associated with the carrier',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      licensePlate: '1234ABC',
      carModel: 'Volvo FH',
      capacity: 20000,
      fuelType: 'diesel',
      status: 'available',
    },
    type: 'string',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    default: null,
  })
  truck?: Types.ObjectId | null;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
