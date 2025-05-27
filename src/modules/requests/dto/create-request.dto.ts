// Objective: Define a DTO for creating a Request with validation and transformation rules.
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

//*Interfaces
import { RequestPriority } from '../interfaces/request-priority.interface';
import { RequestStatus } from '../interfaces/request-status.interface';

/**
 * Data transfer object for creating a request
 * @export
 * @class CreateRequestDto
 * @example
 * {
 *   "nombre_cliente": "Empresa ABC",
 *  "origen": "Madrid",
 *  "destino": "Barcelona",
 * "fecha_solicitud": "2023-08-15T10:30:00Z",
 * "fecha_entrega": "2023-08-20T14:00:00Z",
 * "estado": "delivered",
 * "prioridad": "high"
 * }
 */
export class CreateRequestDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Empresa ABC',
  })
  @IsString()
  @IsNotEmpty()
  nombre_cliente: string;

  @ApiProperty({
    description: 'Origen del envío',
    example: 'Madrid',
  })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({
    description: 'Destino del envío',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({
    description: 'Fecha de solicitud',
    example: '2023-08-15T10:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  fecha_solicitud: Date;

  @ApiProperty({
    description: 'Fecha de entrega estimada',
    example: '2023-08-20T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  fecha_entrega?: Date;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 'pendiente',
    enum: RequestStatus,
    default: RequestStatus.pending,
  })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({
    description: 'Prioridad de la solicitud',
    example: 'alta',
    enum: RequestPriority,
    default: RequestPriority.medium,
  })
  @IsString()
  @IsOptional()
  prioridad?: string;
}
