import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
  @ApiProperty({
    description: 'Client name',
    example: 'ABC Company',
  })
  @IsString()
  @IsNotEmpty()
  client_name: string;

  @ApiProperty({
    description: 'Shipment origin',
    example: 'Madrid',
  })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({
    description: 'Shipment destination',
    example: 'Barcelona',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    description: 'Request date',
    example: '2023-08-15T10:30:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  request_date?: Date;

  @ApiProperty({
    description: 'Estimated delivery date',
    example: '2023-08-20T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  delivery_date: Date;

  @ApiProperty({
    description: 'Request status',
    example: 'pending',
    enum: ['pending', 'in_transit', 'delivered', 'cancelled'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Request priority',
    example: 'high',
    enum: ['low', 'normal', 'high', 'urgent'],
  })
  @IsString()
  @IsOptional()
  priority?: string;
}
