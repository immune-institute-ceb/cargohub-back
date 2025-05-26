// Objective: Define the facturacion entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Facturacion entity schema
 * @param _id Facturacion id
 * @param nombreCliente Nombre del cliente
 * @param importe Importe de la facturacion
 * @param idServicios Array de ids de servicios
 * @param fechaEmision Fecha de emision de la factura
 * @param fechaVencimiento Fecha de vencimiento de la factura
 * @param estado Estado de la factura (pendiente, pagada, cancelada)
 * @returns Facturacion entity schema
 */
@Schema({ timestamps: true })
export class Facturacion extends Document {
  @ApiProperty({
    description: 'Facturacion id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Perez' })
  @Prop({ required: true, index: true })
  nombreCliente: string;

  @ApiProperty({ description: 'Importe de la facturacion', example: 100 })
  @Prop({ required: true, index: true })
  importe: number;

  @ApiProperty({
    description: 'Array de ids de servicios',
    example: ['bajo15935746280'],
  })
  @Prop({ index: true })
  idServicios: string[];

  @ApiProperty({
    description: 'Fecha de emision de la factura',
    example: '2022-01-01',
  })
  @Prop({ required: true, index: true })
  fechaEmision: Date;

  @ApiProperty({
    description: 'Fecha de vencimiento de la factura',
    example: '2022-01-31',
  })
  @Prop({ required: true, index: true })
  fechaVencimiento: Date;

  @ApiProperty({
    description: 'Estado de la factura (pendiente, pagada, cancelada)',
    example: 'pendiente',
    enum: ['pendiente', 'pagada', 'cancelada'],
  })
  @Prop({
    index: true,
    required: true,
    enum: ['pendiente', 'pagada', 'cancelada'],
  })
  estado: string;
}

export const FacturacionSchema = SchemaFactory.createForClass(Facturacion);
