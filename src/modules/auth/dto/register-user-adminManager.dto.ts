// register-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseUserFieldsDto } from './base-user-fields.dto';
import { ValidRoles } from '../interfaces';
import { ArrayContains, ArrayMinSize, IsArray } from 'class-validator';

export class RegisterUserAdminManagerDto extends BaseUserFieldsDto {
  @ApiProperty({ description: 'User email', example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ description: 'User phone', example: '123456789' })
  phone: string;

  @ApiProperty({ description: 'User name', example: 'Test' })
  name: string;

  @ApiProperty({ description: 'User lastName1', example: 'Example' })
  lastName1: string;

  @ApiPropertyOptional({ description: 'User lastName2', example: 'Api' })
  lastName2?: string;

  @ApiProperty({
    description: 'User roles - Only AdminManager allowed',
    example: [ValidRoles.adminManager],
    enum: [ValidRoles.adminManager],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one role must be assigned' })
  @ArrayContains([ValidRoles.adminManager], {
    message: 'Only AdminManager role is allowed',
  })
  roles: ValidRoles;
}
