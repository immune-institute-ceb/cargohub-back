// Objective : Implement the controller for the carriers module
// Endpoints:

//* NestJS Modules
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

//* Services
import { CarriersService } from './carriers.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Carriers')
@Controller('carriers')
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  create(@Body() createCarrierDto: CreateCarrierDto) {
    return this.carriersService.create(createCarrierDto);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'List of all carriers',
    type: [CreateCarrierDto],
  })
  findAll() {
    return this.carriersService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'Carrier found',
    type: CreateCarrierDto,
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carriersService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Carrier updated',
    type: CreateCarrierDto,
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCarrierDto: UpdateCarrierDto,
  ) {
    return this.carriersService.update(id, updateCarrierDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Carrier removed',
    type: CreateCarrierDto,
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carriersService.remove(id);
  }
}
