// Objective: Define the Request entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RequestStatus } from '../interfaces/request-status.interface';
import { RequestPriority } from '../interfaces/request-priority.interface';

/**
 * Request entity schema
 * @param _id Request id
 * @param client_name Client name
 * @param origin Shipment origin
 * @param destination Shipment destination
 * @param request_date Request date
 * @param delivery_date Estimated delivery date
 * @param status Request status (pending, in progress, delivered)
 * @param priority Request priority (normal, high, urgent)
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
    description: 'Client Id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    index: true,
    type: Types.ObjectId,
    ref: 'Client',
  })
  clientId: string;

  @ApiProperty({
    description: 'Shipment origin',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  origin: string;

  @ApiProperty({
    description: 'Shipment destination',
    example: 'Barcelona',
  })
  @Prop({
    index: true,
  })
  destination: string;

  @ApiProperty({
    description: 'Request date',
    example: '2023-08-15T10:30:00Z',
  })
  @Prop({
    index: true,
    default: Date.now,
  })
  request_date: Date;

  @ApiProperty({
    description: 'Estimated delivery date',
    example: '2023-08-20T14:00:00Z',
  })
  @Prop({
    index: true,
  })
  delivery_date: Date;

  @ApiProperty({
    description: 'Request status',
    example: 'pending',
  })
  @Prop({
    index: true,
    enum: RequestStatus,
    default: RequestStatus.pending,
  })
  status: RequestStatus;

  @ApiProperty({
    description: 'Request priority',
    example: 'high',
  })
  @Prop({
    index: true,
    enum: RequestPriority,
    default: RequestPriority.medium,
  })
  priority: RequestPriority;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
