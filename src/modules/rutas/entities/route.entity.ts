// Objective: Define the Ruta entity schema and model for the database

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//* External modules
import mongoose, { Document, Types } from 'mongoose';

// * Interfaces
import { RouteStatus } from '../interfaces/route-status.interface';

/**
 * Route entity schema
 * @param _id Route id
 * @param origin Route origin
 * @param destination Route destination
 * @param distance Route distance in km
 * @param estimatedTime Route estimated time in hours
 * @param status Route status (pending, inTransit, completed, cancelled)
 * @param carrier Carrier assigned to the route
 * @param request Request associated with the route
 * @returns Route entity schema
 */
@Schema({ timestamps: true })
export class Route extends Document {
  @ApiProperty({
    description: 'Route id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Route origin',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  origin: string;

  @ApiProperty({
    description: 'Route destination',
    example: 'Málaga',
  })
  @Prop({
    index: true,
  })
  destination: string;

  @ApiProperty({
    description: 'Route distance in km',
    example: 523,
  })
  @Prop({
    index: true,
  })
  distance: number;

  @ApiProperty({
    description: 'Route estimated time',
    example: 4.5,
  })
  @Prop({
    index: true,
  })
  estimatedTime: number;

  @ApiProperty({
    description: 'Route state',
    example: RouteStatus.pending,
  })
  @Prop({
    index: true,
    enum: RouteStatus,
    default: RouteStatus.pending,
  })
  status: RouteStatus;

  @ApiProperty({
    description: 'Carrier assigned to the route',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      dni: '123456789A',
      licenseNumber: '123456789',
      status: 'available',
    },
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrier',
    default: null,
  })
  carrier?: Types.ObjectId | null;

  @ApiProperty({
    description: 'Request associated with the route',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      clientId: '5f4e6d6f4f6d4f6d4f6d4f6d',
      origin: 'Madrid',
      destination: 'Málaga',
      status: 'pending',
    },
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requests',
    default: null,
  })
  request?: Types.ObjectId | null;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
