// Objective: Implement the controller for the users module

//* NestJS modules
import { Controller, Body, Patch, Delete, Get, Param } from '@nestjs/common';
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

//* Services
import { UsersService } from './users.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { UserWithRelations } from './interfaces/user-with-relations';

@ApiTags('Users')
@ApiNotFoundResponse({ description: 'User not found' })
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error, check the logs',
})
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user')
  @ApiCreatedResponse({
    description: 'User found',
    type: User,
  })
  @ApiOperation({ summary: 'Get user information by Token' })
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
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      oneOf: [
        { example: { message: 'Client ID not found for user' } },
        { example: { message: 'Carrier ID not found for user' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Update user information' })
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
  @ApiOperation({ summary: 'Delete user and its related data by Token' })
  @Auth()
  deleteUser(@GetUser() user: UserWithRelations) {
    return this.usersService.deleteUser(user);
  }

  @Delete('delete-user/admin/:id')
  @ApiCreatedResponse({
    description: 'User deleted by admin',
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
  @ApiOperation({ summary: 'Delete user by admin' })
  @Auth(ValidRoles.admin)
  deleteUserByAdmin(@Param('id') id: string) {
    return this.usersService.deleteUserByAdmin(id);
  }
}
