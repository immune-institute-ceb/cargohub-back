// Purpose: Define the carrier entity schema and model for the database
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';

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
    example: ['available', 'on route', 'resting', 'inactive'],
  })
  @Prop({
    index: true,
    default: ['available'],
  })
  status: string[];

  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
