import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Truck } from './entities/truck.entity';
import { Model } from 'mongoose';
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { TruckStatus } from './interfaces/truck-status.interface';
import { Carrier } from '@modules/carriers/entities/carrier.entity';
import { CarriersService } from '@modules/carriers/carriers.service';

@Injectable()
export class TrucksService {
  constructor(
    @InjectModel(Truck.name)
    private readonly truckModel: Model<Truck>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => CarriersService))
    private readonly carriersService: CarriersService,
  ) {}
  async create(createTruckDto: CreateTruckDto) {
    try {
      const truckCreated = await this.truckModel.create(createTruckDto);
      return {
        message: 'Truck created successfully',
        truck: truckCreated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const trucks = await this.truckModel.find();
      if (!trucks || trucks.length === 0) {
        throw new NotFoundException('No trucks found');
      }
      return trucks;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const truck = await this.truckModel.findById(id);
      if (!truck) throw new NotFoundException('Truck not found');
      return truck;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(id: string, updateTruckDto: UpdateTruckDto) {
    try {
      const truckUpdated = await this.truckModel.findByIdAndUpdate(
        id,
        updateTruckDto,
        { new: true },
      );
      if (!truckUpdated) throw new NotFoundException('Truck not found');
      return truckUpdated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async assignCarrier(truckId: string, carrier: Carrier) {
    try {
      const truck = await this.truckModel.findById(truckId);
      if (!truck) throw new NotFoundException('Truck not found');

      if (truck.status !== TruckStatus.available) {
        throw new BadRequestException('Truck is not available for assignment');
      }

      truck.carrier = carrier._id;
      truck.status = TruckStatus.assigned;

      const updatedTruck = await truck.save();
      return {
        message: 'Truck assigned to carrier successfully',
        truck: updatedTruck,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async unassignCarrier(truckId: string) {
    try {
      const truck = await this.truckModel.findById(truckId);
      if (!truck) throw new NotFoundException('Truck not found');

      if (!truck.carrier) {
        throw new BadRequestException('Truck is not assigned to any carrier');
      }

      truck.carrier = null;
      truck.status = TruckStatus.available;

      const updatedTruck = await truck.save();
      return {
        message: 'Truck unassigned from carrier successfully',
        truck: updatedTruck,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const truckDeleted = await this.truckModel.findByIdAndDelete(id);
      if (!truckDeleted) throw new NotFoundException('Truck not found');
      await this.carriersService.unassignTruckDeleted(id);
      return {
        message: 'Truck deleted successfully',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
