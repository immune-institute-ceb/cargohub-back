// Objective: Define the audit log entity schema and model for the database

//* NestJS modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

//* External modules
import { Document, Types } from 'mongoose';

// * Interfaces
import { AuditLogLevel } from '../interfaces/log-level.interface';
import { AuditLogContext } from '../interfaces/context-log.interface';

/**
 * Audit log entity schema
 * @param _id Log id
 * @param level Log level
 * @param context Context or source of the log
 * @param message Log message
 * @param meta Additional meta information
 * @export
 * @class AuditLog
 */
@Schema({ timestamps: true })
export class AuditLog extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Log level',
    enum: AuditLogLevel,
    example: AuditLogLevel.info,
  })
  @Prop({
    index: true,
    required: true,
    enum: AuditLogLevel,
  })
  level: AuditLogLevel;

  @ApiProperty({
    description: 'Context or source of the log',
    enum: AuditLogContext,
    example: AuditLogContext.authService,
  })
  @Prop({
    index: true,
    required: true,
    enum: AuditLogContext,
  })
  context: AuditLogContext;

  @ApiProperty({
    description: 'Log message',
    example: 'User created successfully',
  })
  @Prop({
    required: true,
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Additional meta information',
    type: Object,
    example: { userId: 'abc123', ip: '127.0.0.1' },
  })
  @Prop({
    type: Object,
    default: {},
  })
  meta?: Record<string, any>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
