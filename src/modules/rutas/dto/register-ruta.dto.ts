// Objective: RegisterRutaDto class to define the structure of the data to be received in the register endpoint
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength } from 'class-validator';

import { Transform, Type } from 'class-transformer';

/**
 * Data transfer object for register route
 * @export
 * @class RegisterRutaDto
 * @example
 * {
 *  "type": "National",
 *  "origen": "Madrid",
 *  "destino": "Málaga",
 *  "distancia": 523,
 *  "tiempoEstimado": 5,
 *  "...": "..."
 * }
 */
export class RegisterRutaDto {
  @ApiProperty({
    description: 'Route type',
    example: 'National',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(1)
  type: string;

  @ApiProperty({
    description: 'Route origen',
    example: 'Madrid',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(1)
  origen: string;

  @ApiProperty({
    description: 'Route destino',
    example: 'Málaga',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(1)
  destino: string;

  @ApiProperty({
    description: 'Route distance',
    example: 523,
  })
  @IsNumber()
  @Type(() => Number)
  distancia: number;

  @ApiProperty({
    description: 'Route type',
    example: 'National',
  })
  @IsNumber()
  @Type(() => Number)
  tiempoEstimado: number;
}
