// Objective: Define the Request entity schema and model for the database

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// * External modules
import { Document, Types } from 'mongoose';

// * Interfaces
import {
  RequestPackageType,
  RequestPriority,
  RequestStatus,
} from '../interfaces';

/**
 * Request entity schema
 * @param _id Request id
 * @param clientId Client Id associated with the request
 * @param origin Shipment origin
 * @param destination Shipment destination
 * @param request_date Date when the request was made
 * @param delivery_date Estimated delivery date
 * @param status Current status of the request (pending, in_progress, done, cancelled)
 * @param priority Priority of the request (low, medium, high)
 * @param routeId Route Id associated with the request
 * @returns Request entity schema
 */
@Schema({ timestamps: true })
export class Requests extends Document {
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
  clientId: Types.ObjectId;

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
    description: 'Package weight in kg',
    example: 10,
  })
  @Prop({
    index: true,
    required: true,
  })
  packageWeight: number;

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
    example: RequestStatus.pending,
  })
  @Prop({
    index: true,
    enum: RequestStatus,
    default: RequestStatus.pending,
  })
  status: RequestStatus;

  @ApiProperty({
    description: 'Package type',
    example: RequestPackageType.box,
  })
  @Prop({
    index: true,
    required: true,
    enum: RequestPackageType,
    default: RequestPackageType.box,
  })
  packageType: RequestPackageType;

  @ApiProperty({
    description: 'Request priority',
    example: RequestPriority.medium,
  })
  @Prop({
    index: true,
    required: true,
    enum: RequestPriority,
    default: RequestPriority.medium,
  })
  priority: RequestPriority;

  @ApiProperty({
    description: 'Route Id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    index: true,
    type: Types.ObjectId,
    ref: 'Route',
  })
  routeId: Types.ObjectId;
}

export const RequestSchema = SchemaFactory.createForClass(Requests);
