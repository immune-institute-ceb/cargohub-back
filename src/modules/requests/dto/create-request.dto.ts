// Objective: Define a DTO for creating a Request with validation and transformation rules.
import { IsCity } from '@common/validators/is-city.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for creating a request
 * @export
 * @class CreateRequestDto
 * @example
 * {
 *   "client_name": "ABC Company",
 *   "origin": "Madrid",
 *   "destination": "Barcelona",
 *   "request_date": "2023-08-15T10:30:00Z",
 *   "delivery_date": "2023-08-20T14:00:00Z",
 *   "status": "delivered",
 *   "priority": "high"
 * }
 */
export class CreateRequestDto {
  @ApiProperty({
    description: 'Origin of the shipment',
    example: 'Madrid',
  })
  @IsString()
  @IsNotEmpty()
  @IsCity({
    message: 'Origin must be a valid city',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  origin: string;

  @ApiProperty({
    description: 'Destination of the shipment',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  @IsCity({
    message: 'Destination must be a valid city',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  destination: string;
}
