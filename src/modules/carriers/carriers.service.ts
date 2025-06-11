// Objective: Implement the service of the carriers module to manage carrier entities.
//* NestJS modules
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// * External modules
import { Model, Types } from 'mongoose';

// * DTOs
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

// * Entities
import { Carrier } from './entities/carrier.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';
import { TrucksService } from '@modules/trucks/trucks.service';
import { RoutesService } from '@modules/rutas/route.service';

//* Interfaces
import { TruckStatus } from '@modules/trucks/interfaces/truck-status.interface';
import { CarrierStatus } from './interfaces/carrier-status.interface';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';
import { User } from '@modules/users/entities/user.entity';
import { ValidRoles } from '@modules/auth/interfaces';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name)
    private readonly carrierModel: Model<Carrier>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => TrucksService))
    private readonly trucksService: TrucksService,
    @Inject(forwardRef(() => RoutesService))
    private readonly routesService: RoutesService,
    private readonly auditLogsService: AuditLogsService,
  ) {}
  async create(createCarrierDto: CreateCarrierDto, userId: Types.ObjectId) {
    try {
      // If userId is provided, set it in the DTO
      const carrierCreated = await this.carrierModel.create({
        ...createCarrierDto,
        user: userId,
      });
      return carrierCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const carriers = await this.carrierModel
        .find()
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      if (!carriers || carriers.length === 0) {
        throw new NotFoundException('No carriers found');
      }
      return carriers;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const carrier = await this.findCarrierWithPopulatedData(id);
      if (!carrier) throw new NotFoundException('Carrier not found');
      return carrier;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findByDniOrLicense(dni: string, licenseNumber: string) {
    try {
      const carrier = await this.carrierModel
        .findOne({
          $or: [{ dni }, { licenseNumber }],
        })
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      return carrier;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getCarriersCount() {
    try {
      const count = await this.carrierModel.countDocuments();
      return count;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(id: string, updateCarrierDto: UpdateCarrierDto) {
    try {
      const { ...update } = updateCarrierDto;

      const carrierUpdated = await this.carrierModel.findOneAndUpdate(
        { _id: id },
        update,
        {
          new: true,
        },
      );
      if (!carrierUpdated) throw new NotFoundException('Carrier not found');
      return {
        message: 'Carrier updated',
        carrierUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateStatus(id: string, status: CarrierStatus) {
    try {
      const carrier = await this.carrierModel.findById(id);
      if (!carrier) throw new NotFoundException('Carrier not found');
      if (carrier.status === status) {
        throw new BadRequestException(`Carrier already has status: ${status}`);
      }
      if (
        status === CarrierStatus.resting &&
        carrier.status !== CarrierStatus.available
      ) {
        throw new BadRequestException('Carrier must be available to rest');
      }
      const carrierUpdated = await this.carrierModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
      if (!carrierUpdated) throw new NotFoundException('Carrier not found');

      const truckId = carrierUpdated.truck?._id?.toString();
      if (!truckId) return;

      const statusMap: Record<CarrierStatus, TruckStatus> = {
        [CarrierStatus.assigned]: TruckStatus.onRoute,
        [CarrierStatus.available]: TruckStatus.assigned,
        [CarrierStatus.onRoute]: TruckStatus.onRoute,
        [CarrierStatus.resting]: TruckStatus.available,
      };

      const newTruckStatus = statusMap[status];
      if (newTruckStatus) {
        await this.trucksService.updateTruckStatus(
          truckId,
          newTruckStatus,
          'CarriersService',
        );
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.carriersService,
        message: `Carrier status updated to ${status}`,
        meta: {
          carrierId: id,
          userId: carrierUpdated.user?._id?.toString(),
          truckId: truckId,
        },
      });
      return carrierUpdated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateCarrierStatus(carrierId: string, status: CarrierStatus) {
    try {
      if (!status) {
        throw new BadRequestException('Status is required in query');
      }
      const carrier = await this.carrierModel.findById(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');
      if (carrier.status === status) {
        throw new BadRequestException(`Carrier already has status: ${status}`);
      }
      if (
        status === CarrierStatus.resting &&
        carrier.status !== CarrierStatus.available
      ) {
        throw new BadRequestException('Carrier must be available to rest');
      }
      if (
        status === CarrierStatus.available &&
        carrier.status !== CarrierStatus.available
      ) {
        const routes = await this.routesService.findRoutesByCarrier(carrierId);
        if (routes && routes.length > 0) {
          throw new BadRequestException(
            'Carrier has assigned routes and cannot be set to available',
          );
        }
      }
      await this.updateStatus(carrierId, status);
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    try {
      const carrierDeleted = await this.carrierModel.findByIdAndDelete(id);

      if (!carrierDeleted) throw new NotFoundException('Carrier not found');
      if (carrierDeleted.truck?._id) {
        await this.trucksService.updateTruckStatus(
          carrierDeleted.truck._id.toString(),
          TruckStatus.available,
          'CarriersService',
        );
      }
      await this.routesService.unassignRouteFromCarrierRemoved(id, user);
      return {
        message: 'Carrier deleted',
        carrierDeleted,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async assignTruck(carrierId: string, truckId: string) {
    try {
      const carrier = await this.findCarrierWithPopulatedData(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');

      const truckExists = await this.trucksService.findOne(truckId);
      if (!truckExists) throw new NotFoundException('Truck not found');
      if (
        truckExists.status === TruckStatus.assigned ||
        truckExists.status === TruckStatus.onRoute ||
        truckExists.status === TruckStatus.maintenance
      ) {
        throw new BadRequestException('Truck is not available');
      }
      if (
        carrier.status === CarrierStatus.onRoute ||
        carrier.status === CarrierStatus.assigned ||
        carrier.status === CarrierStatus.resting
      ) {
        throw new BadRequestException('Carrier is not available');
      }
      if (carrier.truck?._id && carrier.truck._id.toString() !== truckId) {
        await this.trucksService.updateTruckStatus(
          carrier.truck._id.toString(),
          TruckStatus.available,
          'CarriersService',
        );
      }
      await this.trucksService.updateTruckStatus(
        truckId,
        TruckStatus.assigned,
        'CarriersService',
      );

      carrier.truck = truckExists._id;
      await carrier.save();

      return {
        message: 'Truck assigned to carrier',
        carrier,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unassignTruck(carrierId: string) {
    try {
      const carrier = await this.findCarrierWithPopulatedData(carrierId);

      if (!carrier) throw new NotFoundException('Carrier not found');

      if (!carrier.truck) {
        throw new BadRequestException('Carrier does not have a truck assigned');
      }
      if (carrier.status === CarrierStatus.onRoute) {
        throw new BadRequestException('Carrier is currently on a route');
      }
      if (carrier.status === CarrierStatus.assigned) {
        throw new BadRequestException(
          'Carrier is currently assigned to a route, please unassign first',
        );
      }
      await this.trucksService.updateTruckStatus(
        carrier.truck._id.toString(),
        TruckStatus.available,
        'CarriersService',
      );

      carrier.truck = null;
      await carrier.save();

      return {
        message: 'Truck unassigned from carrier',
        carrier,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unassignTruckDeleted(truckId: string, user: User) {
    try {
      const carrier = await this.carrierModel
        .findOne({ truck: truckId })
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      if (!carrier) return;

      carrier.truck = null;
      carrier.status = CarrierStatus.available;
      await this.routesService.unassignRouteFromCarrierRemoved(
        carrier._id.toString(),
        user,
      );
      await carrier.save();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getCarrierRoutes(carrierId: string, user: User) {
    try {
      const carrier = await this.findCarrierWithPopulatedData(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');
      if (!user?.roles.includes(ValidRoles.admin || ValidRoles.adminManager)) {
        if (carrier.user?._id?.toString() !== user._id.toString()) {
          throw new BadRequestException('You can only access your own routes');
        }
      }
      const routes = await this.routesService.findRoutesByCarrier(carrierId);
      if (!routes || routes.length === 0) {
        throw new NotFoundException('No routes found for this carrier');
      }
      return routes;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findCarrierWithPopulatedData(carrierId: string) {
    try {
      const carrier = await this.carrierModel
        .findById(carrierId)
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      if (!carrier) throw new NotFoundException('Carrier not found');
      return carrier;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
