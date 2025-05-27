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
  @ApiBearerAuth()
  @Auth()
  deleteUser(@GetUser() user: UserWithRelations) {
    return this.usersService.deleteUser(user);
  }

  @Delete('archive-user')
  @ApiCreatedResponse({
    description: 'User archived',
  })
  @ApiBearerAuth()
  @Auth()
  archiveUser(@GetUser() user: UserWithRelations) {
    return this.usersService.archiveUser(user);
  }

  @Patch('restore-user')
  @ApiCreatedResponse({
    description: 'User restored',
  })
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
