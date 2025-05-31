// Objective: Dto to create an audit log entry, with validation rules and Swagger documentation

// * NestJS modules
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// * Interfaces
import { AuditLogLevel } from '../interfaces/log-level.interface';
import { AuditLogContext } from '../interfaces/context-log.interface';

/**
 * Data transfer object to create an audit log entry
 * @export
 * @class CreateAuditLogDto
 * @example
 * {
 *  "level": "info",
 * "context": "AuthService",
 * "message": "User created successfully",
 * "meta": { "userId": "abc123", "ip": "::1" }
 * }
 */
export class CreateAuditLogDto {
  @ApiProperty({
    description: 'Log level',
    enum: AuditLogLevel,
    example: 'info',
  })
  @IsEnum(AuditLogLevel, {
    message: `Level must be one of: ${Object.values(AuditLogLevel).join(', ')}`,
    each: true,
  })
  level: string;

  @ApiProperty({
    description: 'Context or source of the log',
    example: 'AuthService',
    enum: AuditLogContext,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AuditLogContext, {
    message: `Context must be one of: ${Object.values(AuditLogContext).join(', ')}`,
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
