// Objective: Implement the controller of the clients module to manage client entities.

//* NestJS modules
import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { UpdateClientDto } from './dto/update-client.dto';

//* Entities
import { Client } from './entities/client.entity';

// * Services
import { ClientsService } from './clients.service';

@ApiTags('Clients')
@ApiNotFoundResponse({ description: 'Client not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
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
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: Client,
  })
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Client updated',
    type: Client,
  })
  @ApiOperation({ summary: 'Update client by ID' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }
}
