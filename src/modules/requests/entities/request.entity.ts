// Objective: Define the Request entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Request entity schema
 * @param _id Request id
 * @param nombre_cliente Nombre del cliente
 * @param origen Origen del envío
 * @param destino Destino del envío
 * @param fecha_solicitud Fecha de solicitud
 * @param fecha_entrega Fecha de entrega estimada
 * @param estado Estado de la solicitud (pendiente, en proceso, entregado)
 * @param prioridad Prioridad de la solicitud (normal, alta, urgente)
 * @returns Request entity schema
 */
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
