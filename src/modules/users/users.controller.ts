// Objective: Implement the controller for the users module

//* NestJS modules
import { Controller, Body, Patch, Delete } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import {
  ChangePasswordDto,
  RestoreUserDto,
  UpdateUserDto,
} from '@modules/auth/dto';

//* Decorators
import { Auth, GetUser } from '@modules/auth/decorators';

//* Interfaces
import { ValidRoles } from '@modules/auth/interfaces';

//* Entities
import { User } from '@modules/users/entities/user.entity';
import { UserWithRelations } from './interfaces/user-with-relations';

//* Services
import { UsersService } from './users.service';

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

  @Patch('update-user')
  @ApiCreatedResponse({
    description: 'User updated',
    type: User,
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

  @Patch('update-user-password')
  @ApiCreatedResponse({
    description: 'Password updated',
  })
  @ApiOperation({ summary: 'Update user password' })
  @ApiBearerAuth()
  @Auth()
  updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: UserWithRelations,
  ) {
    return this.usersService.updatePassword(changePasswordDto, user);
  }

  @Delete('delete-user')
  @ApiCreatedResponse({
    description: 'User deleted',
  })
  @ApiOperation({ summary: 'Delete user by Token' })
  @ApiBearerAuth()
  @Auth()
  deleteUser(@GetUser() user: UserWithRelations) {
    return this.usersService.deleteUser(user);
  }

  @Delete('archive-user')
  @ApiCreatedResponse({
    description: 'User archived',
  })
  @ApiOperation({ summary: 'Archive user by Token' })
  @ApiBearerAuth()
  @Auth()
  archiveUser(@GetUser() user: UserWithRelations) {
    return this.usersService.archiveUser(user);
  }

  @Patch('restore-user')
  @ApiCreatedResponse({
    description: 'User restored',
  })
  @ApiOperation({ summary: 'Restore user by email' })
  @ApiForbiddenResponse({
    description: 'Forbidden, user related',
    schema: {
      example: { message: 'User needs a valid role' },
    },
  })
  @ApiBearerAuth()
  @Auth(ValidRoles.admin)
  restoreUser(@Body() restoreUserDto: RestoreUserDto) {
    return this.usersService.restoreUser(restoreUserDto);
  }
}
