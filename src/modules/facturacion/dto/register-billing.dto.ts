// Objective: RegisterFacturacionDto class definition
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  IsDate,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

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
  @ApiProperty({ description: 'Client Name', example: 'Juan Perez' })
  @IsString()
  @Matches(/^[a-zA-Z\sáéíóúüñÁÉÍÓÚÜÑ]+$/, {
    message: 'clientName must contain only letters and spaces',
  })
  @MaxLength(100)
  @Transform(({ value }) => value.toLowerCase().trim())
  clientName: string;

  @ApiProperty({ description: 'Billing Amount', example: 100 })
  @IsNumber()
  @Min(0)
  billingAmount: number;

  @ApiProperty({ description: 'Array of service IDs' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  idServices: string[];

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
  @Matches(/^(pending|paid|canceled)$/, {
    message: 'status must be pending, paid or canceled',
  })
  status: string;
}
