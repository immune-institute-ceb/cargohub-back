// Objective: Define the facturacion entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Facturacion entity schema
 * @param _id Facturacion id
 * @param clientName Nombre del cliente
 * @param billingAmount Importe de la facturacion
 * @param idServices Array de ids de servicios
 * @param issueDate Fecha de emision de la factura
 * @param dueDate Fecha de vencimiento de la factura
 * @param status Estado de la factura (pendiente, pagada, cancelada)
 * @returns Facturacion entity schema
 */
@Schema({ timestamps: true })
export class Billing extends Document {
  @ApiProperty({
    description: 'Billing id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Client Name', example: 'Juan Perez' })
  @Prop({ required: true, index: true })
  clientName: string;

  @ApiProperty({ description: 'Billing Amount', example: 100 })
  @Prop({ required: true, index: true })
  billingAmount: number;

  @ApiProperty({
    description: 'Array of service IDs',
    example: ['bajo15935746280'],
  })
  @Prop({ index: true })
  idServices: string[];

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2022-01-01',
  })
  @Prop({ required: true, index: true })
  issueDate: Date;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2022-01-31',
  })
  @Prop({ required: true, index: true })
  dueDate: Date;

  @ApiProperty({
    description: 'Invoice status (pending, paid, canceled)',
    example: 'pending',
    enum: ['pending', 'paid', 'canceled'],
  })
  @Prop({
    index: true,
    required: true,
    enum: ['pending', 'paid', 'canceled'],
  })
  status: string;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
