// Objective: Define the user entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

/**
 * User entity schema
 * @param _id User id
 * @param email User email
 * @param phone User phone
 * @param password User password
 * @param name User name
 * @param lastName1 User first last name
 * @param lastName2 User second last name
 * @param image User image
 * @param isActive Tells if the user is active
 * @param roles User roles
 * @param permissions User permissions
 * @param createdAt User creation date
 * @param deletedAt User deletion date
 * @param isDeleted Tells if the user is deleted
 * @param twoFactorAuth User two-factor authentication code
 * @param twoFactorQrCode User two-factor authentication QR code
 * @param twoFactorAuthEnabled Tells if the user has two-factor authentication enabled
 * @param clientId Client id associated with the user
 * @param carrierId Carrier id associated with the user
 * @export
 * @class User
 */
@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
    type: 'string',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @ApiProperty({
    description: 'User phone',
    example: '123456789',
  })
  @Prop({
    index: true,
  })
  phone: string;

  @ApiProperty({
    description: 'User password',
    example: 'Test1234',
  })
  @Prop({
    index: true,
    select: false,
  })
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'Test',
  })
  @Prop({
    index: true,
  })
  name: string;

  @ApiProperty({
    description: 'User lastName1',
    example: 'Example',
  })
  @Prop({
    index: true,
  })
  lastName1: string;

  @ApiProperty({
    description: 'User lastName2',
    example: 'Api',
  })
  @Prop({
    index: true,
  })
  lastName2: string;

  @ApiProperty({
    description: 'User image',
    example: 'https://www.example.com/image.jpg',
  })
  @Prop({
    index: true,
  })
  image: string;

  @ApiProperty({
    description: 'Tells if the user is active',
    example: 'true',
  })
  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User roles',
    example: ['admin', 'client', 'carrier'],
  })
  @Prop({
    index: true,
  })
  roles: string[];

  @ApiProperty({
    description: 'User permissions',
    example: ['read'],
  })
  @Prop({
    index: true,
    default: [],
  })
  permissions: string[];

  @ApiProperty({
    description: 'User createdAt',
    example: '2021-01-01',
  })
  @Prop({
    index: true,
    default: Date.now,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User deletedAt',
    example: '2021-01-01',
  })
  @Prop({
    index: true,
  })
  deletedAt: Date;

  @ApiProperty({
    description: 'Tells if the user is deleted',
    example: 'true',
  })
  @Prop({
    index: true,
    default: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'User twoFactorAuth',
    example: '123456',
  })
  @Prop({
    index: true,
    default: '',
  })
  twoFactorAuth?: string;

  @ApiProperty({
    description: 'User 2fa qr code',
    example: 'otpauth://totp/Example',
  })
  @Prop({
    index: true,
    default: '',
  })
  twoFactorQrCode?: string;

  @ApiProperty({
    description: 'User twoFactorAuthEnabled',
    example: 'true',
  })
  @Prop({
    index: true,
    default: false,
  })
  twoFactorAuthEnabled: boolean;

  @ApiProperty({
    description: 'Client id associated with the user',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default: null,
  })
  clientId?: Types.ObjectId;

  @ApiProperty({
    description: 'Carrier id associated with the user',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrier',
    default: null,
  })
  carrierId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
