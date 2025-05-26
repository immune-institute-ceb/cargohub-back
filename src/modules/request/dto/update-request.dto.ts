import { PartialType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';

/**
 * Data transfer object for updating a request
 * @export
 * @class UpdateRequestDto
 * @extends {PartialType(CreateRequestDto)}
 * @example
 * {
 *  "nombre_cliente": "Empresa XYZ",
 *  "origen": "Madrid",
 *  "destino": "Barcelona",
 *  "fecha_entrega": "2025-06-01T00:00:00Z",
 *  "estado": "en_transito",
 *  "prioridad": "alta"
 * }
 */
export class UpdateRequestDto extends PartialType(CreateRequestDto) {}
