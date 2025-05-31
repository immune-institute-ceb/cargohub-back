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

// * Entities
import { Carrier } from './entities/carrier.entity';

// * Decorators
import { Auth } from '@modules/auth/decorators/auth.decorator';

//* Services
import { CarriersService } from './carriers.service';
import { CarrierStatus } from './interfaces/carrier-status.interface';
import { FinalCarrierStatus } from '@modules/clients/dto/update-status.dto';
import { ValidRoles } from '@modules/auth/interfaces';

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
  assignTruck(
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
    @Param('truckId', ParseMongoIdPipe) truckId: string,
  ) {
    return this.carriersService.assignTruck(carrierId, truckId);
  }

  @Post(':carrierId/unassign-truck')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Unassign a truck from a carrier' })
  unassignTruck(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.carriersService.unassignTruck(carrierId);
  }

  @Patch(':carrierId/status')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update carrier status' })
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
