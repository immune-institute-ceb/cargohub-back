import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { LogLevel } from '../interfaces/log-level.interface';
import { ContextLogs } from '../interfaces/context-log.interface';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @ApiProperty({
    description: 'User id',
    example: '5f4e6d6f4f6d4f6d4f6d4f6d',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Log level',
    enum: LogLevel,
    example: LogLevel.info,
  })
  @Prop({
    index: true,
    required: true,
    enum: LogLevel,
  })
  level: LogLevel;

  @ApiProperty({
    description: 'Context or source of the log',
    enum: ContextLogs,
    example: ContextLogs.authService,
  })
  @Prop({
    index: true,
    required: true,
    enum: ContextLogs,
  })
  context: ContextLogs;

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

  @ApiProperty({
    description: 'Date when the log was created',
    example: '2025-05-30T14:52:00.000Z',
  })
  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
