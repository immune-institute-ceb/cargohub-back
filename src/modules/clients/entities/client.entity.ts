// Purpose: Define the client entity schema and model for the database
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';
import { ActiveClientsStatus } from '../interfaces/active-clients.interface';

/**
 * Client entity schema
 * @param _id Client id
 * @param companyName Company name
 * @param companyCIF Company CIF
 * @param companyAddress Company address
 * @param status Client status
 * @param userId User id
 * @returns Client entity schema
 * @example
 * {
 *   _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
 *  companyName: 'Test Company',
 *  companyCIF: 'B12345678',
 * companyAddress: '123 Main St, Madrid',
 * status: ['active'],
 * userId: '5f4e6d6f4f6d4f6d4f6d4f6d'
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
    enum: ActiveClientsStatus,
    example: ActiveClientsStatus.active,
  })
  @Prop({
    index: true,
    enum: ActiveClientsStatus,
    default: ActiveClientsStatus.active,
  })
  status: string[];

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
