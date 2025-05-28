// Objective: Define the data transfer object to update a facturacion data.
import { PartialType } from '@nestjs/swagger';

import { RegisterBillingDto } from './register-billing.dto';

/**
 * Data transfer object for update billing
 * @export
 * @class UpdateBillingDto
 * @extends {PartialType(RegisterBillingDto)}
 * @example
 * {
 *  "clientName": "Juan Perez",
 *  "billingAmount": 150,
 *  "issueDate": "2023-01-02",
 *  "dueDate": "2023-02-01",
 *  "status": "paid"
 * }
 */
export class UpdateBillingDto extends PartialType(RegisterBillingDto) {}
