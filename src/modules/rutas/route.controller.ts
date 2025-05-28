// Objective: Implement the controller for the routes module

//* NestJS modules
import {
  Controller,
  Body,
  Patch,
  Delete,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

//* Pipes
import { ParseMongoIdPipe } from '@common/pipes/parse-mongo-id.pipe';

//* DTOs
import { RegisterRouteDto } from './dto/register-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

//* Entities
import { Route } from '@modules/rutas/entities/route.entity';

//* Services
import { RoutesService } from './route.service';

@ApiTags('Rutas')
@ApiBearerAuth()
@ApiNotFoundResponse({ description: 'Route not found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('rutas')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Route created', type: Route })
  @ApiOperation({ summary: 'Create a new route' })
  create(@Body() registerRouteDto: RegisterRouteDto) {
    return this.routesService.create(registerRouteDto);
  }

  @Patch(':id')
  @ApiCreatedResponse({ description: 'Route updated', type: Route })
  @ApiOperation({ summary: 'Update an existing route' })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ) {
    const route = await this.routesService.findRouteById(id);
    return this.routesService.update(route, updateRouteDto);
  }

  @Delete('delete-route/:id')
  @ApiCreatedResponse({ description: 'Route deleted' })
  @ApiOperation({ summary: 'Delete a route by Id' })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    const route = await this.routesService.findRouteById(id);
    return this.routesService.deleteRoute(route);
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

  @Get('type/:type')
  @ApiCreatedResponse({ description: 'Routes by type', type: [Route] })
  @ApiOperation({ summary: 'Get routes by type' })
  @ApiNotFoundResponse({ description: 'No routes found for type :type' })
  findByType(@Param('type') type: string) {
    return this.routesService.findRoutesByType(type.toLowerCase().trim());
  }
}
