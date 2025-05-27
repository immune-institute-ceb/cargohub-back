// Objective : Implement the controller for the carriers module
// Endpoints:

//* NestJS Modules
import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { UpdateCarrierDto } from './dto/update-carrier.dto';

// * Entities
import { Carrier } from './entities/carrier.entity';

//* Services
import { CarriersService } from './carriers.service';

@ApiTags('Carriers')
@ApiNotFoundResponse({ description: 'Carrier not found' })
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
  findAll() {
    return this.carriersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Carrier found',
    type: Carrier,
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carriersService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Carrier updated',
    type: Carrier,
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ) {
    return this.carriersService.update(id, updateCarrierDto);
  }
}
