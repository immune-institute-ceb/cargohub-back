// Objective: Define the Ruta entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Route entity schema
 * @param _id Route id
 * @param type Route type
 * @param origen Route origen
 * @param destino Route destino
 * @param distancia Route distance
 * @param tiempoEstimado Route time
 * @param estado Route status
 * @param deletedAt Route deletedAt
 * @param isDeleted Tells if the route is deleted
 * @returns Route entity schema
 */
@Schema({ timestamps: true })
export class Ruta extends Document {
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
    description: 'Route origen',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  origen: string;

  @ApiProperty({
    description: 'Route destino',
    example: 'Málaga',
  })
  @Prop({
    index: true,
  })
  destino: string;

  @ApiProperty({
    description: 'Route distance',
    example: 523,
  })
  @Prop({
    index: true,
  })
  distancia: number;

  @ApiProperty({
    description: 'Route estimated time',
    example: 4.5,
  })
  @Prop({
    index: true,
  })
  tiempoEstimado: number;

  @ApiProperty({
    description: 'Route state',
    example: 'available',
  })
  @Prop({
    index: true,
  })
  estado: string;

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

export const RutaSchema = SchemaFactory.createForClass(Ruta);
