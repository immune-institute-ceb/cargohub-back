// Objective: Implement the controller of the clients module to manage client entities.

//* NestJS modules
import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Entities
import { Client } from './entities/client.entity';

// * Decorators
import { Auth } from '@modules/auth/decorators/auth.decorator';

// * Services
import { ClientsService } from './clients.service';

//* Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { ClientsStatus } from './interfaces/active-clients.interface';

@ApiTags('Clients')
@ApiNotFoundResponse({
  description: 'Not Found',
  schema: {
    oneOf: [
      { example: { message: 'Client not found' } },
      { example: { message: 'No clients found' } },
    ],
  },
})
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'List of all clients',
    type: [Client],
  })
  @ApiOperation({ summary: 'Get all clients' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: Client,
  })
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiResponse({
    status: 200,
    description: 'Client status updated successfully',
    type: Client,
  })
  @ApiOperation({ summary: 'Update client status' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: { message: 'Client already has this status' },
    },
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the client',
    enum: ClientsStatus,
  })
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.client)
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('status') status: ClientsStatus,
  ) {
    return this.clientsService.updateStatus(id, status);
  }
}
