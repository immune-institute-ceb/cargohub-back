// Objective : Implement the controller for the carriers module
// Endpoints:

//* NestJS Modules
import { Controller, Get, Param, Post } from '@nestjs/common';
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

// * Entities
import { Carrier } from './entities/carrier.entity';

//* Services
import { CarriersService } from './carriers.service';

@ApiTags('Carriers')
@ApiNotFoundResponse({
  description: 'Not Found',
  schema: {
    oneOf: [
      { example: { message: 'Carrier not found' } },
      { example: { message: 'No carriers found' } },
    ],
  },
})
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('carriers')
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all carriers',
    type: [Carrier],
  })
  @ApiOperation({ summary: 'Get all carriers' })
  findAll() {
    return this.carriersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Carrier found',
    type: Carrier,
  })
  @ApiOperation({ summary: 'Get carrier by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carriersService.findOne(id);
  }

  @Post(':carrierId/assign-truck/:truckId')
  @ApiOperation({ summary: 'Assign a truck to a carrier' })
  assignTruck(
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
    @Param('truckId', ParseMongoIdPipe) truckId: string,
  ) {
    return this.carriersService.assignTruck(carrierId, truckId);
  }

  @Post(':carrierId/unassign-truck')
  @ApiOperation({ summary: 'Unassign a truck from a carrier' })
  unassignTruck(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.carriersService.unassignTruck(carrierId);
  }
}
