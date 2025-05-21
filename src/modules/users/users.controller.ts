// Objective: Implement the controller for the users module

//* NestJS modules
import {
  Controller,
  Body,
  Patch,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

//* External modules
import { Express } from 'express';

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

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Services
import { UsersService } from './users.service';

//* Entities
import { User } from '@modules/users/entities/user.entity';

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
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
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
    @GetUser() user: User,
  ) {
    return this.usersService.updatePassword(changePasswordDto, user);
  }

  @Patch('suscribe-newsletter')
  @ApiCreatedResponse({
    description: 'User subscribed to newsletter',
    type: User,
  })
  @ApiBearerAuth()
  @Auth()
  suscribeNewsLetter(@GetUser() user: User) {
    return this.usersService.suscribeNewsLetter(user);
  }

  @Patch('unsuscribe-newsletter')
  @ApiCreatedResponse({
    description: 'User unsubscribed to newsletter',
    type: User,
  })
  @ApiBearerAuth()
  @Auth()
  unsuscribeNewsLetter(@GetUser() user: User) {
    return this.usersService.unsuscribeNewsLetter(user);
  }

  @Delete('delete-user')
  @ApiCreatedResponse({
    description: 'User deleted',
  })
  @ApiBearerAuth()
  @Auth()
  deleteUser(@GetUser() user: User) {
    return this.usersService.deleteUser(user);
  }

  @Delete('archive-user')
  @ApiCreatedResponse({
    description: 'User archived',
  })
  @ApiBearerAuth()
  @Auth()
  archiveUser(@GetUser() user: User) {
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

  // @Post('upload-csv')
  // @ApiCreatedResponse({
  //   description: 'CSV uploaded',
  //   type: User,
  // })
  // @ApiBadRequestResponse({
  //   description: 'Bad Request, file related',
  //   schema: {
  //     oneOf: [
  //       { example: { message: 'Unexpected field' } },
  //       {
  //         example: {
  //           message:
  //             'Validation failed (current file type is image/jpeg, expected type is csv)',
  //         },
  //       },
  //       { example: { message: 'File is required' } },
  //     ],
  //   },
  // })
  // @ApiBearerAuth()
  // @Auth()
  // @ApiOperation({ summary: 'Upload CSV file' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // uploadCSV(
  //   @GetUser() user: User,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: 'csv' })],
  //     }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return this.usersService.uploadCSV(user, file);
  // }

  // @Get('files/:Userid')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Files retrieved',
  //   schema: {
  //     example: {
  //       message: 'Files retrieved',
  //       files: ['file1', 'file2'],
  //     },
  //   },
  // })
  // getFiles(@Param('Userid', ParseMongoIdPipe) id: string) {
  //   return this.usersService.getFiles(id);
  // }

  // @Delete('files/:Userid')
  // @ApiCreatedResponse({
  //   description: 'File deleted',
  //   type: User,
  // })
  // deleteFile(
  //   @Param('Userid', ParseMongoIdPipe) id: string,
  //   @Query('ListIndexFile') file: number,
  // ) {
  //   return this.usersService.deleteFile(id, file);
  // }
}
