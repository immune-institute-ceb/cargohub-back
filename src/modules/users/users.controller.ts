// Objective: Implement the controller for the users module

//* NestJS modules
import { Controller, Body, Patch, Delete, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

//* DTOs
import { UpdateUserDto } from '@modules/auth/dto';

//* Decorators
import { Auth, GetUser } from '@modules/auth/decorators';

//* Entities
import { User } from '@modules/users/entities/user.entity';
import { UserWithRelations } from './interfaces/user-with-relations';

//* Services
import { UsersService } from './users.service';
import { ValidRoles } from '@modules/auth/interfaces';

@ApiTags('Users')
@ApiNotFoundResponse({
  description: 'Not Found',
  schema: {
    oneOf: [{ example: { message: 'User not found' } }],
  },
})
@ApiBadRequestResponse({
  description: 'Bad Request',
  schema: {
    oneOf: [
      { example: { message: 'Passwords do not match' } },
      { example: { message: 'User already archived' } },
      { example: { message: 'User not archived' } },
      { example: { message: 'Error uploading file to IPFS' } },
      { example: { message: 'No files found' } },
    ],
  },
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error, check the logs',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiCreatedResponse({
    description: 'User found',
    type: User,
  })
  @ApiOperation({ summary: 'Get user information by Token' })
  @ApiBearerAuth()
  @Auth(ValidRoles.admin)
  getUser(@GetUser() user: UserWithRelations) {
    return this.usersService.getUser(user);
  }

  @Patch('update-user')
  @ApiCreatedResponse({
    description: 'User updated',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request, body validation failed',
    schema: {
      oneOf: [
        {
          example: {
            message: 'Carrier data is not allowed for users with client role',
          },
        },
        {
          example: {
            message: 'Client data is not allowed for users with carrier role',
          },
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Update user information' })
  @ApiBearerAuth()
  @Auth()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: UserWithRelations,
  ) {
    return this.usersService.update(user, updateUserDto);
  }

  @Delete('delete-user')
  @ApiCreatedResponse({
    description: 'User deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      oneOf: [
        { example: { message: 'Client ID not found for user' } },
        { example: { message: 'Carrier ID not found for user' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Delete user by Token' })
  @ApiBearerAuth()
  @Auth()
  deleteUser(@GetUser() user: UserWithRelations) {
    return this.usersService.deleteUser(user);
  }
}
