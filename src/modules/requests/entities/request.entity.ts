import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Request extends Document {
  @ApiProperty({
    description: 'Request id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Client name',
    example: 'ABC Company',
  })
  @Prop({
    index: true,
    required: true,
  })
  nombre_cliente: string;

  @ApiProperty({
    description: 'Shipping origin',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  origen: string;

  @ApiProperty({
    description: 'Shipping destination',
    example: 'Barcelona',
  })
  @Prop({
    index: true,
  })
  destino: string;

  @ApiProperty({
    description: 'Request date',
    example: '2023-08-15T10:30:00Z',
  })
  @Prop({
    index: true,
    default: Date.now,
  })
  fecha_solicitud: Date;

  @ApiProperty({
    description: 'Estimated delivery date',
    example: '2023-08-20T14:00:00Z',
  })
  @Prop({
    index: true,
  })
  fecha_entrega: Date;

  @ApiProperty({
    description: 'Request status',
    example: 'pending',
  })
  @Prop({
    index: true,
    default: 'pending',
  })
  estado: string;

  @ApiProperty({
    description: 'Request priority',
    example: 'high',
  })
  @Prop({
    index: true,
    default: 'normal',
  })
  prioridad: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
