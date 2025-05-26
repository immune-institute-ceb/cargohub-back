import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';

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
    select: false,
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
    example: ['active', 'inactive'],
  })
  @Prop({
    index: true,
    default: ['active'],
  })
  status: string[];

  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
