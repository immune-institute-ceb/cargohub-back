// Objective: Define the Ruta entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Route entity schema
 * @param _id Route id
 * @param type Route type
 * @param origin Route origin
 * @param destination Route destination
 * @param distance Route distance
 * @param estimatedTime Route estimated time
 * @param status Route status
 * @param deletedAt Route deletedAt
 * @param isDeleted Tells if the route is deleted
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
    description: 'Route type',
    example: 'National',
  })
  @Prop({
    index: true,
  })
  type: string;

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
    description: 'Route distance',
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
    example: 'available',
  })
  @Prop({
    index: true,
  })
  status: string;

  @ApiProperty({
    description: 'Route deletedAt',
    example: '2021-01-01',
  })
  @Prop({
    index: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Tells if the route is deleted',
    example: 'true',
  })
  @Prop({
    index: true,
    default: false,
  })
  isDeleted: boolean;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
