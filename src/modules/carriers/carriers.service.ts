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
import { Model, ObjectId } from 'mongoose';

// * DTOs
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

// * Entities
import { Carrier } from './entities/carrier.entity';

//* Modules
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { TrucksService } from '@modules/trucks/trucks.service';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name)
    private readonly carrierModel: Model<Carrier>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => TrucksService))
    private readonly trucksService: TrucksService,
  ) {}
  async create(createCarrierDto: CreateCarrierDto, userId: ObjectId) {
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
      const carrier = await this.carrierModel
        .findById(id)
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('truck', 'licensePlate carModel capacity status fuelType');
      if (!carrier) throw new NotFoundException('Carrier not found');
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

  async remove(id: string) {
    try {
      const carrierDeleted = await this.carrierModel.findByIdAndDelete(id);
      if (!carrierDeleted) throw new NotFoundException('Carrier not found');
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
      const carrier = await this.carrierModel.findById(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');

      const truckExists = await this.trucksService.findOne(truckId);
      if (!truckExists) throw new NotFoundException('Truck not found');
      console.log(truckExists);
      if (carrier.truck !== null) {
        throw new NotFoundException('Carrier already has a truck assigned');
      }
      if (truckExists.carrier !== null) {
        throw new NotFoundException('Truck is already assigned to a carrier');
      }
      const { truck } = await this.trucksService.assignCarrier(
        truckId,
        carrier,
      );
      if (!truck) {
        throw new NotFoundException('Truck could not be assigned to carrier');
      }
      carrier.truck = truck._id;
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
      const carrier = await this.carrierModel.findById(carrierId);
      if (!carrier) throw new NotFoundException('Carrier not found');

      if (!carrier.truck) {
        throw new NotFoundException('Carrier does not have a truck assigned');
      }
      const truck = await this.trucksService.findOne(carrier.truck.toString());
      if (!truck) throw new NotFoundException('Truck not found');
      if (truck.carrier?.toString() !== carrierId) {
        throw new NotFoundException('Truck is not assigned to this carrier');
      }
      await this.trucksService.unassignCarrier(truck._id.toString());

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
      const carrier = await this.carrierModel.findOne({ truck: truckId });
      if (!carrier) return;

      carrier.truck = null;
      await carrier.save();
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
