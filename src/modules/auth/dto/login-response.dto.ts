// Purpose: DTO for login response.

//* NestJS modules
import { ApiProperty } from '@nestjs/swagger';

// * Entities
import { User } from '../../users/entities/user.entity';

/**
 * Data transfer object for login response
 * @export
 * @class LoginResponseDto
 * @example
 * {
 *  "user": {
 *    "id": 1,
 *    "email": "test@gmail.com",
 *    "firstName": "Test",
 *    "lastName": "User",
 *    "role": "user",
 *    "...": "..."
 *   },
 *  "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'User object',
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'JWT access token',
    type: String,
    format: 'jwt',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
