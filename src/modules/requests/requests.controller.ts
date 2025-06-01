// Objetive: Implement a controller for handling requests in a NestJS application.

//* NestJS modules
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { CreateRequestDto } from './dto/create-request.dto';
import { FinalClientStatus } from './dto/update-status.dto';

// * Entities
import { Requests } from './entities/request.entity';
import { User } from '@modules/users/entities/user.entity';

// * Decorators
import { Auth, GetUser } from '@modules/auth/decorators';

//* Services
import { RequestsService } from './requests.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { RequestStatus } from './interfaces';

@ApiTags('Requests')
@ApiNotFoundResponse({ description: 'Request not found' })
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.client)
  @ApiOperation({ summary: 'Create a new request' })
  @ApiCreatedResponse({
    description: 'Request created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Request already exists for this client' } },
        { example: { message: 'Request could not be created' } },
      ],
    },
  })
  create(@Body() createRequestDto: CreateRequestDto, @GetUser() user) {
    return this.requestsService.create(createRequestDto, user as User);
  }

  @Get('clientRequest/:clientId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.client)
  @ApiOperation({ summary: 'Get all requests by Client Id (not userId)' })
  @ApiResponse({
    status: 200,
    description: 'Return all requests from the client',
    type: [Requests],
  })
  @ApiNotFoundResponse({
    description: 'No requests found for this client',
  })
  findAllRequestsByClientId(
    @Param('clientId', ParseMongoIdPipe) clientId: string,
  ) {
    return this.requestsService.findAllRequestsByClientId(clientId);
  }

  @Get(':requestId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiOperation({ summary: 'Get a request by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the request',
    type: Requests,
  })
  findOne(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch('status/:requestId')
  @Auth(ValidRoles.admin, ValidRoles.client)
  @ApiOperation({ summary: 'Update request status' })
  @ApiResponse({
    status: 200,
    description: 'Request status updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        {
          example: {
            message: 'Client is inactive and cannot update request status',
          },
        },
        {
          example: {
            message: 'You can only update requests for your own client',
          },
        },
        {
          example: {
            message: 'Request can only be cancelled if it is pending',
          },
        },
        { example: { message: 'Request already has this status' } },
        {
          example: {
            message:
              'Request is already marked as completed and cannot be updated',
          },
        },
        {
          example: {
            message:
              'Route must be done before request can be marked as done or completed',
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the request',
    enum: [RequestStatus.done, RequestStatus.cancelled],
  })
  updateStatus(
    @GetUser() user,
    @Param('requestId', ParseMongoIdPipe) id: string,
    @Query(
      'status',
      new ParseEnumPipe([RequestStatus.done, RequestStatus.cancelled], {
        errorHttpStatusCode: 400,
        exceptionFactory: () => new BadRequestException('Status must be done'),
      }),
    )
    status: FinalClientStatus,
  ) {
    return this.requestsService.updateStatus(id, status, user as User);
  }

  @Delete(':requestId')
  @Auth(ValidRoles.admin, ValidRoles.client)
  @ApiOperation({ summary: 'Delete a request' })
  @ApiResponse({
    status: 200,
    description: 'Request deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Request could not be deleted',
  })
  remove(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.remove(id);
  }
}
