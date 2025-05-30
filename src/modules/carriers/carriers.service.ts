// Objective: Implement the service of the carriers module to manage carrier entities.
//* NestJS modules
import {
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

//* Modules
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { TrucksService } from '@modules/trucks/trucks.service';
import { RoutesService } from '@modules/rutas/route.service';
import { TruckStatus } from '@modules/trucks/interfaces/truck-status.interface';
import { CarrierStatus } from './interfaces/carrier-status.interface';

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

  async finByDni(dni: string) {
    try {
      const carrier = await this.carrierModel
        .findOne({ dni })
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      return carrier;
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
      const carrierUpdated = await this.carrierModel.findOneAndUpdate(
        { _id: id },
        { status },
        {
          new: true,
        },
      );
      if (!carrierUpdated) throw new NotFoundException('Carrier not found');
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const carrierDeleted = await this.carrierModel.findByIdAndDelete(id);

      if (!carrierDeleted) throw new NotFoundException('Carrier not found');
      if (carrierDeleted.truck?._id) {
        await this.trucksService.updateTruckStatus(
          carrierDeleted.truck._id.toString(),
          TruckStatus.available,
        );
      }
      await this.routesService.unassignRouteFromCarrierRemoved(id);
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
      if (truckExists.status === TruckStatus.assigned) {
        throw new NotFoundException('Truck is not available');
      }
      if (
        carrier.status === CarrierStatus.onRoute ||
        carrier.status === CarrierStatus.assigned
      ) {
        throw new NotFoundException('Carrier is not available');
      }
      if (carrier.truck?._id && carrier.truck._id.toString() !== truckId) {
        await this.trucksService.updateTruckStatus(
          carrier.truck._id.toString(),
          TruckStatus.available,
        );
      }
      await this.trucksService.updateTruckStatus(truckId, TruckStatus.assigned);

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
        throw new NotFoundException('Carrier does not have a truck assigned');
      }
      if (carrier.status === CarrierStatus.onRoute) {
        throw new NotFoundException('Carrier is currently on a route');
      }
      await this.trucksService.updateTruckStatus(
        carrier.truck._id.toString(),
        TruckStatus.available,
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

  async unassignTruckDeleted(truckId: string) {
    try {
      const carrier = await this.carrierModel
        .findOne({ truck: truckId })
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      if (!carrier) return;

      carrier.truck = null;
      await carrier.save();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getCarrierRoutes(carrierId: string) {
    try {
      const carrier = await this.findCarrierWithPopulatedData(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');

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
