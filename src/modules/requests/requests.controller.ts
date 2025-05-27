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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestDto } from './dto';
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';
import { Auth } from '@modules/auth/decorators';

@ApiTags('Requests')
@ApiNotFoundResponse({
  description: 'Request not found',
  schema: {
    example: { message: 'Request not found' },
  },
})
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiCreatedResponse({
    description: 'Request created successfully',
  })
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Get all requests' })
  @ApiResponse({
    status: 200,
    description: 'Return all requests',
  })
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':requestId')
  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Get a request by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the request',
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
    description: 'Request successfully deleted',
    schema: {
      example: { message: 'Request deleted successfully' },
    },
  })
  remove(@Param('requestId', ParseMongoIdPipe) id: string) {
    return this.requestsService.remove(id);
  }
}
