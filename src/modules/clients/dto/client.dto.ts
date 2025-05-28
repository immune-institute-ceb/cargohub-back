import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { CreateClientDto } from './create-client.dto';

export class ClientDto extends CreateClientDto {
  @ApiProperty({
    description: 'User id',
    example: {
      _id: '5f4e6d6f4f6d4f6d4f6d4f6d',
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
    },
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
