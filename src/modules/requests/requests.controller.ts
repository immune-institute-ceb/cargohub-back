// Objetive: Implement a controller for handling requests in a NestJS application.

//* NestJS modules
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

// * Decorators
import { Auth, GetUser } from '@modules/auth/decorators';

//* Services
import { RequestsService } from './requests.service';
import { ValidRoles } from '@modules/auth/interfaces';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('Requests')
@ApiNotFoundResponse({ description: 'Request not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiBearerAuth()
  @Auth(ValidRoles.client)
  @ApiOperation({ summary: 'Create a new request' })
  @ApiCreatedResponse({
    description: 'Request created successfully',
  })
  create(@Body() createRequestDto: CreateRequestDto, @GetUser() user) {
    return this.requestsService.create(createRequestDto, user as User);
  }

  @Get(':clientId')
  @ApiBearerAuth()
  @Auth()
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
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Get a request by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the request',
    type: Request,
  })
  findOne(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':requestId')
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Update a request' })
  @ApiResponse({
    status: 200,
    description: 'Return the updated request',
    type: Request,
  })
  update(
    @Param('requestId', ParseMongoIdPipe) id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return this.requestsService.update(id, updateRequestDto);
  }

  @Delete(':requestId')
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Delete a request' })
  @ApiResponse({
    status: 200,
    description: 'Request deleted successfully',
  })
  remove(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.remove(id);
  }
}
