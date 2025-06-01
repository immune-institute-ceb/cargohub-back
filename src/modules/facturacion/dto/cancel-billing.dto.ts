// Objetive: Define a DTO for cancelling a billing in a NestJS application.

// * NestJS modules
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsIn, IsNotEmpty } from 'class-validator';

// * Interfaces
import { BillingStatus } from '../interfaces/billing-status.interface';

/**
 * Data transfer object for cancelling a billing
 * @export
 * @class CancelBillingDto
 * @example
 * {
 *   "billingId": "60d5ec49f1c2b8b1f8c8b8b8",
 *  "status": "cancelled"
 * }
 */
export class CancelBillingDto {
  @ApiProperty({
    description: 'ID of the billing to be cancelled',
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  billingId: string;

  @ApiProperty({
    description: 'Status of the billing after cancellation',
    enum: [BillingStatus],
    default: BillingStatus,
  })
  @IsIn([BillingStatus], {
    message: `Status must be one of the following: ${Object.values(BillingStatus).join(', ')}`,
    each: true,
  })
  @IsNotEmpty()
  status: BillingStatus;
}
