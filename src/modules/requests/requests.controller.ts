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

// * Decorators
import { Auth, GetUser } from '@modules/auth/decorators';

//* Services
import { RequestsService } from './requests.service';
import { ValidRoles } from '@modules/auth/interfaces';
import { User } from '@modules/users/entities/user.entity';
import { RequestStatus } from './interfaces/request-status.interface';
import { FinalClientStatus } from './dto/update-status.dto';

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
  create(@Body() createRequestDto: CreateRequestDto, @GetUser() user) {
    return this.requestsService.create(createRequestDto, user as User);
  }

  @Get('clientRequest/:clientId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.client)
  @ApiOperation({ summary: 'Get all requests by Client Id (not userId)' })
  @ApiResponse({
    status: 200,
    description: 'Return all requests from the client',
    type: [Request],
  })
  findAllRequestsByClientId(
    @Param('clientId', ParseMongoIdPipe) clientId: string,
  ) {
    return this.requestsService.findAllRequestsByClientId(clientId);
  }

  @Get(':requestId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.client)
  @ApiOperation({ summary: 'Get a request by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the request',
    type: Request,
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
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the request',
    enum: [RequestStatus.done, RequestStatus.cancelled],
  })
  updateStatus(
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
    return this.requestsService.updateStatus(id, status);
  }

  @Delete(':requestId')
  @Auth(ValidRoles.admin, ValidRoles.client)
  @ApiOperation({ summary: 'Delete a request' })
  @ApiResponse({
    status: 200,
    description: 'Request deleted successfully',
  })
  remove(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.remove(id);
  }
}
