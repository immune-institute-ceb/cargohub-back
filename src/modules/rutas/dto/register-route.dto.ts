// Objective: RegisterRutaDto class to define the structure of the data to be received in the register endpoint

//* NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Data transfer object for register route
 * @export
 * @class RegisterRouteDto
 * @example
 * {
 *  "origin": "Madrid",
 *  "destination": "Málaga",
 * }
 */
export class RegisterRouteDto {
  @ApiProperty({
    description: 'Route origin',
    example: 'Madrid',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(1)
  origin: string;

  @ApiProperty({
    description: 'Route destination',
    example: 'Málaga',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  @MinLength(1)
  destination: string;
}
