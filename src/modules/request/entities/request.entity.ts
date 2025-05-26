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
    description: 'Nombre del cliente',
    example: 'Empresa ABC',
  })
  @Prop({
    index: true,
    required: true,
  })
  nombre_cliente: string;

  @ApiProperty({
    description: 'Origen del envío',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  origen: string;

  @ApiProperty({
    description: 'Destino del envío',
    example: 'Barcelona',
  })
  @Prop({
    index: true,
  })
  destino: string;

  @ApiProperty({
    description: 'Fecha de solicitud',
    example: '2023-08-15T10:30:00Z',
  })
  @Prop({
    index: true,
    default: Date.now,
  })
  fecha_solicitud: Date;

  @ApiProperty({
    description: 'Fecha de entrega estimada',
    example: '2023-08-20T14:00:00Z',
  })
  @Prop({
    index: true,
  })
  fecha_entrega: Date;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 'pendiente',
  })
  @Prop({
    index: true,
    default: 'pendiente',
  })
  estado: string;

  @ApiProperty({
    description: 'Prioridad de la solicitud',
    example: 'alta',
  })
  @Prop({
    index: true,
    default: 'normal',
  })
  prioridad: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
