// Objective: RegisterFacturacionDto class definition
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNumber,
  IsString,
  Min,
  IsMongoId,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';
import { BillingStatus } from '../interfaces/billing-status.interface';
import { Types } from 'mongoose';

/**
 * Data transfer object for register facturacion
 * @export
 * @class RegisterFacturacionDto
 * @example
 * {
 *  "clientName": "Juan Perez",
 *  "billingAmount": 100,
 *  "idServices": ["60d5ec49f1c2b8b1f8c8b8b8"],
 *  "issueDate": "2023-01-01",
 *  "dueDate": "2023-01-31",
 *  "status": "pending"
 * }
 */
export class RegisterBillingDto {
  @ApiProperty({
    description: 'Client Id',
    example: '60d5ec49f1c2b8b1f8c8b8b8',
    type: 'string',
  })
  @IsString()
  @IsMongoId()
  clientId: Types.ObjectId;

  @ApiProperty({
    description: 'Request Id',
    example: '60d5ec49f1c2b8b1f8c8b8b8',
    type: 'string',
  })
  @IsString()
  @IsMongoId()
  requestId: Types.ObjectId;

  @ApiProperty({ description: 'Billing Amount', example: 100 })
  @IsNumber()
  @Min(0)
  billingAmount: number;

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2023-01-01',
  })
  @Type(() => Date)
  @IsDate()
  issueDate: Date;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2023-01-31',
  })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'Invoice status (pending, paid, canceled)',
    example: 'pending',
  })
  @IsString()
  @IsEnum(BillingStatus, {
    each: true,
    message: 'Status must be one of the following: pending, paid, canceled',
  })
  status: BillingStatus;
}
