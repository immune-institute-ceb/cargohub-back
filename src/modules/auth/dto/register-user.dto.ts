// Objective: RegisterUserDto class to define the structure of the data to be received in the register endpoint
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

/**
 * Data transfer object for register user
 * @export
 * @class RegisterUserDto
 * @example
 * {
 *  "email": "test@gmail.com",
 *  "phone": "123456789",
 *  "password": "Password123",
 *  "name": "Test",
 *  "lastName1": "Example",
 *  "lastName2": "Api",
 *  "username": "TestExampleApi",
 *  "dateOfBirth": "2000-01-01",
 *  "location": "Madrid",
 *  "...": "..."
 * }
 */
export class RegisterUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User phone',
    example: '123456789',
  })
  @IsString()
  @IsPhoneNumber('ES')
  phone: string;

  @ApiProperty({
    description:
      'User password, must have a Uppercase, lowercase letter and a number',
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'Test',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'User lastName1',
    example: 'Example',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  lastName1: string;

  @ApiProperty({
    description: 'User lastName2',
    example: 'Api',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @IsOptional()
  lastName2: string;

  @ApiProperty({
    description: 'User username',
    example: 'TestExampleApi',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: 'User dateOfBirth',
    example: '2000-01-01',
  })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'User location',
    example: 'Madrid',
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsString()
  @MinLength(1)
  location: string;

  @ApiProperty({
    description: 'User suscribed',
    example: 'true',
  })
  @IsBoolean()
  suscribed: boolean;
}
