// Objective: Implement the service to manage the user entity.

//* NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { RegisterRouteDto } from './dto/register-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

//* Entities
import { Route } from './entities/route.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name)
    private readonly routeModel: Model<Route>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(registerRouteDto: RegisterRouteDto) {
    try {
      const routeCreated = await this.routeModel.create(registerRouteDto);
      return routeCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(route: Route, updateRouteDto: UpdateRouteDto) {
    try {
      const { ...update } = updateRouteDto;

      const routeUpdated = await this.routeModel.findOneAndUpdate(
        { _id: route._id },
        update,
        {
          new: true,
        },
      );

      if (!routeUpdated) throw new NotFoundException('Route not found');

      return {
        message: 'Route updated',
        routeUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteRoute(route: Route) {
    try {
      await this.routeModel.findOneAndDelete({ _id: route._id });
      return { message: 'Route deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllRoutes() {
    try {
      const routes = await this.routeModel.find();
      if (!routes) throw new NotFoundException('Routes not found');
      return routes;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findRouteById(id: string) {
    try {
      const route = await this.routeModel.findById(id);

      if (!route) throw new NotFoundException('Route not found');

      return route;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findRoutesByType(type: string) {
    try {
      const routes = await this.routeModel.find({ type });
      if (!routes)
        throw new NotFoundException(`No routes found for type: ${type}`);
      return routes;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
