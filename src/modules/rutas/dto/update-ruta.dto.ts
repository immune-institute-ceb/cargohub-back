// Objective: Define the data transfer object to update a route data.
import { PartialType } from '@nestjs/swagger';

import { RegisterRutaDto } from './register-ruta.dto';

/**
 * Data transfer object for update route
 * @export
 * @class UpdateRutaDto
 * @extends {PartialType(RegisterRutaDto)}
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
export class UpdateRutaDto extends PartialType(RegisterRutaDto) {}
