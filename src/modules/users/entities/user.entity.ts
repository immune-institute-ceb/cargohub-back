// Objective: Define the user entity schema and model for the database
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * User entity schema
 * @param _id User id
 * @param email User email
 * @param phone User phone
 * @param password User password
 * @param name User name
 * @param lastName1 User lastName1
 * @param lastName2 User lastName2
 * @param username User username
 * @param dateOfBirth User dateOfBirth
 * @param image User image
 * @param location User location
 * @param isActive Tells if the user is active
 * @param suscribed Tells if the user is suscribed to the newsletter
 * @param roles User roles
 * @param csvfile User csv file
 * @param membership User membership
 * @param permissions User permissions
 * @param deletedAt User deletedAt
 * @param isDeleted Tells if the user is deleted
 * @param twoFactorAuth User twoFactorAuth
 * @param twoFactorAuthEnabled User twoFactorAuthEnabled
 * @returns User entity schema
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
    description: 'User username',
    example: 'TestExampleApi',
  })
  @Prop({
    index: true,
  })
  username: string;

  @ApiProperty({
    description: 'User dateOfBirth',
    example: '2000-01-01',
  })
  @Prop({
    index: true,
  })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User image',
    example: 'https://www.example.com/image.jpg',
  })
  @Prop({
    index: true,
  })
  image: string;

  @ApiProperty({
    description: 'User location',
    example: 'Madrid',
  })
  @Prop({
    index: true,
  })
  location: string;

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
    description: 'Tells if the user is suscribed to the newsletter',
    example: 'true',
  })
  @Prop({
    index: true,
  })
  suscribed: boolean;

  @ApiProperty({
    description: 'User roles',
    example: ['user'],
  })
  @Prop({
    index: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    description: 'User csv file',
    example: ['https://www.example.com/file.csv'],
  })
  @Prop({
    index: true,
    default: [],
  })
  csvfile: string[];

  @ApiProperty({
    description: 'User membership',
    example: ['basic'],
  })
  @Prop({
    index: true,
    default: ['basic'],
  })
  membership: string[];

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
}

export const UserSchema = SchemaFactory.createForClass(User);
