// Objective: RegisterUserDto class to define the structure of the data to be received in the register endpoint
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
 *  "nombreCliente": "Juan Perez",
 *  "importe": 100,
 *  "idServicios": ["60d5ec49f1c2b8b1f8c8b8b8"],
 *  "fechaEmision": "2023-01-01",
 *  "fechaVencimiento": "2023-01-31",
 *  "estado": "pendiente"
 * }
 */
export class RegisterFacturacionDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Perez' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MaxLength(100)
  nombreCliente: string;

  @ApiProperty({ description: 'Importe de la facturacion', example: 100 })
  @IsNumber()
  @Min(0)
  importe: number;

  @ApiProperty({ description: 'Array de ids de servicios' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  idServicios: string[];

  @ApiProperty({
    description: 'Fecha de emision de la factura',
    example: '2023-01-01',
  })
  @Type(() => Date)
  @IsDate()
  fechaEmision: Date;

  @ApiProperty({
    description: 'Fecha de vencimiento de la factura',
    example: '2023-01-31',
  })
  @Type(() => Date)
  @IsDate()
  fechaVencimiento: Date;

  @ApiProperty({
    description: 'Estado de la factura (pendiente, pagada, cancelada)',
    example: 'pendiente',
  })
  @IsString()
  @Matches(/^(pendiente|pagada|cancelada)$/, {
    message: 'Estado debe ser pendiente, pagada o cancelada',
  })
  estado: string;
}
