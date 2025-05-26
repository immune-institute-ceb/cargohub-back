// Objective: Define the data transfer object to update a user data.
import { PartialType } from '@nestjs/swagger';

import { RegisterFacturacionDto } from './register-facturacion.dto';

/**
 * Data transfer object for update facturacion
 * @export
 * @class UpdateFacturacionDto
 * @extends {PartialType(RegisterFacturacionDto)}
 * @example
 * {
 *  "nombreCliente": "Juan Perez",
 *  "importe": 150,
 *  "fechaEmision": "2023-01-02",
 *  "fechaVencimiento": "2023-02-01",
 *  "estado": "pagada"
 * }
 */
export class UpdateFacturacionDto extends PartialType(RegisterFacturacionDto) {}
