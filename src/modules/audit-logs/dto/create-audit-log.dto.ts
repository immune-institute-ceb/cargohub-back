import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogLevel } from '../interfaces/log-level.interface';
import { ContextLogs } from '../interfaces/context-log.interface';

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'Log level',
    enum: LogLevel,
    example: 'info',
  })
  @IsEnum(LogLevel, {
    message: `Level must be one of: ${Object.values(LogLevel).join(', ')}`,
    each: true,
  })
  level: string;

  @ApiProperty({
    description: 'Context or source of the log',
    example: 'AuthService',
    enum: ContextLogs,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ContextLogs, {
    message: `Context must be one of: ${Object.values(ContextLogs).join(', ')}`,
    each: true,
  })
  context: string;

  @ApiProperty({
    description: 'Log message',
    example: 'User created successfully',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Additional meta information',
    type: Object,
    example: { userId: 'abc123', ip: '127.0.0.1' },
  })
  @IsOptional()
  @IsObject()
  @Type(() => Object)
  meta?: Record<string, any>;
}
