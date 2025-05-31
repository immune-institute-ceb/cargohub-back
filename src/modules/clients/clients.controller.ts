// Objective: Implement the controller of the clients module to manage client entities.

//* NestJS modules
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
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
import { ValidRoles } from '@modules/auth/interfaces';

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
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
}
