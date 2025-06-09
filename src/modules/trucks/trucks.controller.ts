// Objective: Implement a controller for managing trucks in a logistics application, including CRUD operations and status updates.

// * NestJS modules
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

//* DTOs
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { FinalTruckStatus } from './dto/update-status.dto';

// * Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Decorators
import { Auth } from '@modules/auth/decorators';

// * Entities
import { Truck } from './entities/truck.entity';

// * Services
import { TrucksService } from './trucks.service';

// * Interfaces
import { TruckStatus } from './interfaces/truck-status.interface';
import { ValidRoles } from '@modules/auth/interfaces';

@Controller('trucks')
@ApiNotFoundResponse({ description: 'Truck not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiBearerAuth()
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Create a new truck' })
  @ApiBadRequestResponse({ description: 'Truck could not be created' })
  @ApiCreatedResponse({
    description: 'Truck created successfully',
    type: Truck,
  })
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiOperation({ summary: 'Get all trucks' })
  @ApiCreatedResponse({
    description: 'List of all trucks',
    type: [Truck],
  })
  findAll() {
    return this.trucksService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiOperation({ summary: 'Get a truck by ID' })
  @ApiCreatedResponse({
    description: 'Truck found successfully',
    type: Truck,
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a truck by ID' })
  @ApiCreatedResponse({
    description: 'Truck updated successfully',
    type: Truck,
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Patch('status/:id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update truck status' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the request',
    enum: [TruckStatus.maintenance],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        {
          example: {
            message: 'Truck can only enter maintenance from available status',
          },
        },
        {
          example: {
            message:
              'Truck can only return to available status from maintenance',
          },
        },
        { example: { message: 'Truck is already in this status' } },
        { example: { message: 'Status must be maintenance or available' } },
      ],
    },
  })
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query(
      'status',
      new ParseEnumPipe([TruckStatus.maintenance, TruckStatus.available], {
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException('Status must be maintenance or available'),
      }),
    )
    status: FinalTruckStatus,
  ) {
    return this.trucksService.updateTruckStatus(id, status, 'TrucksController');
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a truck by ID' })
  @ApiCreatedResponse({
    description: 'Truck deleted successfully',
    type: Truck,
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.trucksService.remove(id);
  }
}
