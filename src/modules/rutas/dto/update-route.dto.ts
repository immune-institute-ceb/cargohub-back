// Objective: Define the data transfer object to update a route data.
import { PartialType } from '@nestjs/swagger';

import { RegisterRouteDto } from './register-route.dto';

/**
 * Data transfer object for update route
 * @export
 * @class UpdateRouteDto
 * @extends {PartialType(RegisterRouteDto)}
 * @example
 * {
 *  "type": "National",
 *  "origin": "Madrid",
 *  "destination": "Málaga",
 *  "distance": 523,
 *  "estimatedTime": 5,
 *  "...": "..."
 * }
 */
export class UpdateRouteDto extends PartialType(RegisterRouteDto) {}
