// Objective: Define the facturacion entity schema and model for the database

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// * External modules
import { Document, Types } from 'mongoose';

// * Interfaces
import { BillingStatus } from '../interfaces/billing-status.interface';

/**
 * Facturacion entity schema
 * @param _id Facturacion id
 * @param requestId Request Id associated with the billing
 * @param clientId Client Id associated with the billing
 * @param billingAmount Amount to be billed
 * @param issueDate Date when the invoice is issued
 * @param dueDate Date when the invoice is due
 * @param paidDate Date when the invoice is paid (optional)
 * @param status Status of the invoice (pending, paid, canceled)
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

  @ApiProperty({
    description: 'Request Id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    index: true,
    type: Types.ObjectId,
    ref: 'Requests',
  })
  requestId: Types.ObjectId;

  @ApiProperty({
    description: 'Client Id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    index: true,
    type: Types.ObjectId,
    ref: 'Client',
  })
  clientId: Types.ObjectId;

  @ApiProperty({ description: 'Billing Amount', example: 100 })
  @Prop({ required: true, index: true })
  billingAmount: number;

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
    description: 'Paid date of the invoice',
    example: '2022-01-15',
  })
  @Prop({ index: true })
  paidDate?: Date;

  @ApiProperty({
    description: 'Invoice status (pending, paid, canceled)',
    example: 'pending',
    enum: BillingStatus,
  })
  @Prop({
    index: true,
    required: true,
    enum: BillingStatus,
  })
  status: BillingStatus;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
