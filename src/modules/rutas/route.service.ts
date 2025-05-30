// Objective: Implement the service to manage the user entity.

//* NestJS modules
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';
import * as cities from 'all-the-cities';
import { getDistance } from 'geolib';

//* DTOs
import { RegisterRouteDto } from './dto/register-route.dto';

//* Entities
import { Route } from './entities/route.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { CarriersService } from '@modules/carriers/carriers.service';
import { RouteStatus } from './interfaces/route-status.interface';
import { CarrierStatus } from '@modules/carriers/interfaces/carrier-status.interface';
import { RequestsService } from '@modules/requests/requests.service';
import { Requests } from '@modules/requests/entities/request.entity';
import { RequestStatus } from '@modules/requests/interfaces/request-status.interface';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name)
    private readonly routeModel: Model<Route>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => CarriersService))
    private readonly carriersService: CarriersService,
    @Inject(forwardRef(() => RequestsService))
    private readonly requestsService: RequestsService,
  ) {}

  async create(registerRouteDto: RegisterRouteDto, request: Requests) {
    try {
      const routeCreated = await this.routeModel.create(registerRouteDto);
      if (!routeCreated)
        throw new InternalServerErrorException('Route creation failed');
      const distance = this.calcDistance(routeCreated);
      if (distance !== null && distance !== undefined) {
        routeCreated.distance = distance;
        routeCreated.estimatedTime = distance / 80; // Assuming an average speed of 80 km/h
        await routeCreated.save();
      }

      routeCreated.request = request._id;
      await routeCreated.save();
      return routeCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateRouteStatus(id: string, status: RouteStatus) {
    try {
      const route = await this.routeModel.findById(id);
      if (!route) throw new NotFoundException('Route not found');

      if (route.status === status) {
        throw new BadRequestException(`Route is already in ${status} status`);
      }
      if (
        status === RouteStatus.done &&
        route.status !== RouteStatus.inTransit
      ) {
        throw new BadRequestException(
          'Route must be in transit to mark as done',
        );
      }

      if (
        (status === RouteStatus.inTransit || status === RouteStatus.done) &&
        !route.carrier
      ) {
        throw new BadRequestException(
          'Route cannot be in transit or done without an assigned carrier',
        );
      }

      const requestId = route.request?._id?.toString();
      if (!requestId) {
        throw new NotFoundException('Request ID not found for this route');
      }

      switch (status) {
        case RouteStatus.issued:
          await this.requestsService.updateStatus(
            requestId,
            RequestStatus.issued,
          );
          break;

        case RouteStatus.inTransit:
          await this.requestsService.updateStatus(
            requestId,
            RequestStatus.inProgress,
          );

          if (!route.carrier?._id) {
            throw new NotFoundException('Carrier not found for this route');
          }

          await this.carriersService.updateStatus(
            route.carrier._id.toString(),
            CarrierStatus.onRoute,
          );
          break;

        case RouteStatus.pending:
          await this.requestsService.updateStatus(
            requestId,
            RequestStatus.pending,
          );
          break;
      }

      route.status = status;
      await route.save();

      return {
        message: `Route status updated to ${status}`,
        route,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllRoutes() {
    try {
      const routes = await this.routeModel.find();
      if (!routes || routes.length === 0) {
        throw new NotFoundException('No routes found');
      }
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

  async findRoutesByStatus(status: string) {
    try {
      const routes = await this.routeModel.find({ status });

      if (!routes || routes.length === 0) {
        throw new NotFoundException('No routes found with this status');
      }

      return routes;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findRoutesByCarrier(carrierId: string) {
    try {
      const routes = await this.routeModel.find({ carrier: carrierId });

      if (!routes || routes.length === 0) {
        throw new NotFoundException('No routes found for this carrier');
      }

      return routes;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteRoute(id: string) {
    try {
      const route = await this.routeModel.findByIdAndDelete(id);
      if (route) {
        const carrierId = route.carrier?._id
          ? route.carrier._id.toString()
          : undefined;
        if (carrierId) {
          const carrier = await this.carriersService.findOne(carrierId);
          if (carrier) {
            await this.carriersService.updateStatus(
              carrier._id.toString(),
              CarrierStatus.available,
            );
          }
        }
      }

      return {
        message: 'Route deleted successfully',
        route,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async assignCarrierToRoute(routeId: string, carrierId: string) {
    try {
      const route = await this.routeModel.findById(routeId);
      if (!route) throw new NotFoundException('Route not found');

      const carrier = await this.carriersService.findOne(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');

      if (!carrier.truck) {
        throw new NotFoundException('Carrier does not have a truck assigned');
      }
      if (
        carrier.status !== CarrierStatus.resting &&
        carrier.status !== CarrierStatus.available
      ) {
        throw new NotFoundException('Carrier is not available');
      }
      if (route.carrier?._id.toString() === carrier._id.toString()) {
        throw new NotFoundException(
          'Route is already assigned to this carrier',
        );
      }
      if (route.status !== RouteStatus.pending) {
        throw new BadRequestException(
          'Route must be in pending status to assign a carrier',
        );
      }
      await this.carriersService.updateStatus(
        carrier._id.toString(),
        CarrierStatus.assigned,
      );

      route.carrier = carrier._id;
      await route.save();

      return {
        message: 'Route assigned to carrier',
        route,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unassignRouteFromCarrier(routeId: string) {
    try {
      const route = await this.routeModel.findById(routeId);
      if (!route) throw new NotFoundException('Route not found');

      if (!route.carrier) {
        throw new NotFoundException('Route does not have a carrier assigned');
      }
      if (route.status === RouteStatus.inTransit) {
        throw new BadRequestException(
          'Route is currently in progress and cannot be unassigned',
        );
      }
      const carrier = await this.carriersService.findOne(
        route.carrier._id.toString(),
      );
      if (!carrier) throw new NotFoundException('Carrier not found');
      if (
        carrier.status === CarrierStatus.assigned &&
        route.carrier._id.toString() !== carrier._id.toString()
      ) {
        throw new NotFoundException('Carrier is not assigned to this route');
      }
      await this.carriersService.updateStatus(
        carrier._id.toString(),
        CarrierStatus.available,
      );

      route.carrier = null;
      route.status = RouteStatus.pending;
      await route.save();

      return {
        message: 'Route unassigned from carrier',
        route,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unassignRouteFromCarrierRemoved(carrierId: string) {
    try {
      const routes = await this.routeModel.find({ carrier: carrierId });

      if (routes) {
        for (const route of routes) {
          route.carrier = null;
          await route.save();
          await this.updateRouteStatus(
            route._id.toString(),
            RouteStatus.pending,
          );
        }
      }

      return {
        message: 'All routes unassigned from carrier',
        routes,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  calcDistance(route: Route): number | null {
    try {
      // Simulate distance calculation
      const originCity = cities.filter(
        (city) =>
          city.name.toLowerCase() === route.origin.toLowerCase() &&
          city.population > 500000,
      );
      const destinationCity = cities.filter(
        (city) =>
          city.name.toLowerCase() === route.destination.toLowerCase() &&
          city.population > 500000,
      );
      if (!originCity.length || !destinationCity.length) {
        throw new NotFoundException('Origin or destination city not found');
      }
      const distance = getDistance(
        {
          latitude: originCity[0].loc.coordinates[1],
          longitude: originCity[0].loc.coordinates[0],
        },
        {
          latitude: destinationCity[0].loc.coordinates[1],
          longitude: destinationCity[0].loc.coordinates[0],
        },
      );
      return distance / 1000; // Convert to kilometers
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
      return null;
    }
  }
}
