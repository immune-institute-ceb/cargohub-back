import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsIn, IsNotEmpty } from 'class-validator';
import { BillingStatus } from '../interfaces/billing-status.interface';

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
