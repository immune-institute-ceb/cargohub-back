// Purpose: Define the client entity schema and model for the database
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';
import { ClientsStatus } from '../interfaces/active-clients.interface';

/**
 * Client entity schema
 * @param _id Client id
 * @param companyName Company name
 * @param companyCIF Company CIF
 * @param companyAddress Company address
 * @param status Client status
 * @param userId User id
 * @param requests Client requests
 * @returns Client entity schema
 * @example
 * {
 *   _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
 *  companyName: 'Test Company',
 *  companyCIF: 'B12345678',
 * companyAddress: '123 Main St, Madrid',
 * status: ['active'],
 * userId: '5f4e6d6f4f6d4f6d4f6d4f6d'
 * requests: [
 *  {
 *    _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
 *   origin: 'Madrid',
 *  destination: 'Barcelona',
 *  request_date: '2023-08-15T10:30:00Z',
 *  delivery_date: '2023-08-20T14:00:00Z',
 *  status: 'pending',
 *  prioriy: 'normal',
 * }
 * }
 */
@Schema({ timestamps: true })
export class Client extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Company name',
    example: 'Test',
  })
  @Prop({
    index: true,
  })
  companyName: string;

  @ApiProperty({
    description: 'Company CIF',
    example: 'B12345678',
  })
  @Prop({
    index: true,
  })
  companyCIF: string;

  @ApiProperty({
    description: 'Company address',
    example: '123 Main St, Madrid',
  })
  @Prop({
    index: true,
  })
  companyAddress: string;

  @ApiProperty({
    description: 'Client status',
    enum: ClientsStatus,
    example: ClientsStatus.active,
  })
  @Prop({
    index: true,
    enum: ClientsStatus,
    default: ClientsStatus.active,
  })
  status: ClientsStatus;

  @ApiProperty({
    description: 'User id',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
    },
    type: 'string',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  user?: Types.ObjectId;

  @ApiProperty({
    description: 'Client requests',
    example: [
      {
        _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
        origin: 'Madrid',
        destination: 'Barcelona',
        request_date: '2023-08-15T10:30:00Z',
        delivery_date: '2023-08-20T14:00:00Z',
        status: 'pending',
        prioriy: 'normal',
      },
    ],
    type: 'array',
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Requests' }],
    default: [],
  })
  requests?: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
