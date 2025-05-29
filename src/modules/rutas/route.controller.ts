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

//* DTOs

//* Entities
import { Route } from '@modules/rutas/entities/route.entity';

//* Services
import { RoutesService } from './route.service';
import { RouteStatus } from './interfaces/route-status.interface';

@ApiTags('Rutas')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Route not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('rutas')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Patch('status/:id')
  @ApiCreatedResponse({ description: 'Route status updated', type: Route })
  @ApiOperation({ summary: 'Update the status of a route' })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the route',
    enum: RouteStatus,
  })
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Query('status') status: RouteStatus,
  ) {
    return this.routesService.updateRouteStatus(id, status);
  }

  @Get()
  @ApiCreatedResponse({ description: 'All routes', type: [Route] })
  @ApiOperation({ summary: 'Get all routes' })
  findAll() {
    return this.routesService.findAllRoutes();
  }

  @Get(':id')
  @ApiCreatedResponse({ description: 'Route found', type: Route })
  @ApiOperation({ summary: 'Get route by ID' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.routesService.findRouteById(id);
  }

  @Get('status/:status')
  @ApiCreatedResponse({ description: 'Routes by status', type: [Route] })
  @ApiOperation({ summary: 'Get routes by status' })
  findRoutesByStatus(@Param('status') status: RouteStatus) {
    return this.routesService.findRoutesByStatus(status);
  }

  @Get('carrier/:carrierId')
  @ApiCreatedResponse({ description: 'Routes for carrier', type: [Route] })
  @ApiOperation({ summary: 'Get routes for a specific carrier' })
  findRoutesByCarrier(@Param('carrierId', ParseMongoIdPipe) carrierId: string) {
    return this.routesService.findRoutesByCarrier(carrierId);
  }

  @Post('assign-carrier/:routeId/:carrierId')
  @ApiCreatedResponse({
    description: 'Route assigned to carrier',
    type: Route,
  })
  @ApiOperation({ summary: 'Assign a carrier to route' })
  assignCarrierToRoute(
    @Param('routeId', ParseMongoIdPipe) routeId: string,
    @Param('carrierId', ParseMongoIdPipe) carrierId: string,
  ) {
    return this.routesService.assignCarrierToRoute(routeId, carrierId);
  }

  @Post('unassign-carrier/:routeId')
  @ApiCreatedResponse({
    description: 'Route unassigned from carrier',
    type: Route,
  })
  @ApiOperation({ summary: 'Unassign a route from a carrier' })
  unassignRouteFromCarrier(
    @Param('routeId', ParseMongoIdPipe) routeId: string,
  ) {
    return this.routesService.unassignRouteFromCarrier(routeId);
  }
}
