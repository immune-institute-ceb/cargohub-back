// Objective: Implement the controller for the routes module

//* NestJS modules
import { Controller, Patch, Post, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* Decorators
import { Auth } from '@modules/auth/decorators/auth.decorator';

//* Entities
import { Route } from '@modules/rutas/entities/route.entity';

//* Services
import { RoutesService } from './route.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { RouteStatus } from './interfaces/route-status.interface';
import { GetUser } from '@modules/auth/decorators';
import { User } from '@modules/users/entities/user.entity';

@ApiTags('Routes')
@ApiNotFoundResponse({ description: 'Route not found' })
@ApiBearerAuth()
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Patch('status/:id')
  @Auth(ValidRoles.carrier, ValidRoles.admin)
  @ApiCreatedResponse({ description: 'Route status updated', type: Route })
  @ApiOperation({ summary: 'Update the status of a route' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Route is already in this status' } },
        { example: { message: 'Route must be in transit to mark as done' } },
        { example: { message: 'User is not authorized to update this route' } },
        {
          example: {
            message: 'Route is already marked as done and cannot be updated',
          },
        },
        {
          example: {
            message:
              'Route cannot be in transit or done without an assigned carrier',
          },
        },
        {
          example: {
            message:
              'Cannot update route status because the request is already done or completed',
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the route',
    enum: RouteStatus,
  })
  updateStatus(
    @GetUser() user,
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('status') status: RouteStatus,
  ) {
    return this.routesService.updateRouteStatus(id, status, user as User);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiCreatedResponse({ description: 'All routes', type: [Route] })
  @ApiOperation({ summary: 'Get all routes' })
  findAll() {
    return this.routesService.findAllRoutes();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiCreatedResponse({ description: 'Route found', type: Route })
  @ApiOperation({ summary: 'Get route by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.routesService.findRouteById(id);
  }

  @Get('status/:status')
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  @ApiCreatedResponse({ description: 'Routes by status', type: [Route] })
  @ApiNotFoundResponse({
    description: 'No routes found with this status',
  })
  @ApiOperation({ summary: 'Get routes by status' })
  findRoutesByStatus(@Param('status') status: RouteStatus) {
    return this.routesService.findRoutesByStatus(status);
  }

  @Get('carrier/:carrierId')
  @Auth(ValidRoles.carrier, ValidRoles.admin, ValidRoles.adminManager)
  @ApiCreatedResponse({ description: 'Routes for carrier', type: [Route] })
  @ApiOperation({ summary: 'Get routes for a specific carrier' })
  @ApiNotFoundResponse({
    description: 'No routes found for this carrier',
  })
  findRoutesByCarrier(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.routesService.findRoutesByCarrierId(carrierId);
  }

  @Post('assign-carrier/:routeId/:carrierId')
  @Auth(ValidRoles.admin)
  @ApiCreatedResponse({
    description: 'Route assigned to carrier',
    type: Route,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Carrier does not have a truck assigned' } },
        { example: { message: 'Carrier is not available' } },
        {
          example: {
            message: 'Route must be in pending status to assign a carrier',
          },
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Assign a carrier to route' })
  assignCarrierToRoute(
    @Param('routeId', ParseMongoIdPipe) routeId: string,
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
  ) {
    return this.routesService.assignCarrierToRoute(routeId, carrierId);
  }

  @Post('unassign-carrier/:routeId')
  @Auth(ValidRoles.admin)
  @ApiCreatedResponse({
    description: 'Route unassigned from carrier',
    type: Route,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      oneOf: [
        { example: { message: 'Route does not have a carrier assigned' } },
        {
          example: {
            message: 'Route is currently in progress and cannot be unassigned',
          },
        },
        { example: { message: 'Carrier is not assigned to this route' } },
      ],
    },
  })
  @ApiOperation({ summary: 'Unassign a route from a carrier' })
  unassignRouteFromCarrier(
    @Param('routeId', ParseMongoIdPipe) routeId: string,
  ) {
    return this.routesService.unassignRouteFromCarrier(routeId);
  }
}
