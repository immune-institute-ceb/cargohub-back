import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  fecha_solicitud?: Date;

  @ApiProperty({
    description: 'Fecha de entrega estimada',
    example: '2023-08-20T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fecha_entrega: Date;

  @ApiProperty({
    description: 'Estado de la solicitud',
    example: 'pendiente',
    enum: ['pendiente', 'en_transito', 'entregado', 'cancelado'],
  })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({
    description: 'Prioridad de la solicitud',
    example: 'alta',
    enum: ['baja', 'normal', 'alta', 'urgente'],
  })
  @IsString()
  @IsOptional()
  prioridad?: string;
}
