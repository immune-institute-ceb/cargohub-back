// Objective : Implement the controller for the carriers module
// Endpoints:

//* NestJS Modules
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

// * DTOs
import { FinalCarrierStatus } from '@modules/carriers/dto/update-status.dto';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

// * Entities
import { Carrier } from './entities/carrier.entity';

// * Decorators
import { Auth } from '@modules/auth/decorators/auth.decorator';

//* Services
import { CarriersService } from './carriers.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { CarrierStatus } from './interfaces/carrier-status.interface';

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
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('carriers')
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
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
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiResponse({
    status: 200,
    description: 'Carrier found',
    type: Carrier,
  })
  @ApiOperation({ summary: 'Get carrier by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carriersService.findOne(id);
  }

  @Get('carrierRoutes/:carrierId')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiOperation({ summary: 'Get routes assigned to a carrier' })
  getCarrierRoutes(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.carriersService.getCarrierRoutes(carrierId);
  }

  @Post(':carrierId/assign-truck/:truckId')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Assign a truck to a carrier' })
  @ApiResponse({
    status: 200,
    description: 'Truck assigned to carrier successfully',
    type: Carrier,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Truck is not available' } },
        { example: { message: 'Carrier is not available' } },
      ],
    },
  })
  assignTruck(
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
    @Param('truckId', ParseMongoIdPipe) truckId: string,
  ) {
    return this.carriersService.assignTruck(carrierId, truckId);
  }

  @Post(':carrierId/unassign-truck')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Unassign a truck from a carrier' })
  @ApiResponse({
    status: 200,
    description: 'Truck unassigned from carrier',
    type: Carrier,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Carrier does not have a truck assigned' } },
        { example: { message: 'Carrier is currently on route' } },
      ],
    },
  })
  unassignTruck(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.carriersService.unassignTruck(carrierId);
  }

  @Patch(':carrierId/status')
  @Auth(ValidRoles.admin, ValidRoles.adminManager, ValidRoles.carrier)
  @ApiOperation({ summary: 'Update carrier status' })
  @ApiResponse({
    status: 200,
    description: 'Carrier status updated successfully',
    type: Carrier,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Carrier already has this status' } },
        { example: { message: 'Carrier must be available to rest' } },
        {
          example: {
            message:
              'Carrier has assigned routes and cannot be set to available',
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the carrier',
    enum: [CarrierStatus.resting, CarrierStatus.available],
  })
  updateCarrierStatus(
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
    @Query(
      'status',
      new ParseEnumPipe([CarrierStatus.resting, CarrierStatus.available], {
        errorHttpStatusCode: 400,
        exceptionFactory: () => new BadRequestException('Status must be done'),
      }),
    )
    status: FinalCarrierStatus,
  ) {
    return this.carriersService.updateCarrierStatus(carrierId, status);
  }
}
