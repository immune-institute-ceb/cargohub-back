// Objective: Define the data transfer object to update a user data.
import { OmitType, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { RegisterUserDto } from './register-user.dto';

/**
 * Data transfer object for update user
 * @export
 * @class UpdateUserDto
 * @extends {PartialType(OmitType(RegisterUserDto, ['email', 'password']))}
 * @example
 * {
 *  "name": "John Doe",
 *  "username": "johndoe",
 *  "phone": "+1234567890"
 * }
 */
export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['email', 'password']),
) {
  @Exclude()
  email?: string;

  @Exclude()
  password?: string;
}
