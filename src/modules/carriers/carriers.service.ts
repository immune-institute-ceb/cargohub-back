// Objective: Implement the service of the carriers module to manage carrier entities.
//* NestJS modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// * External modules
import { Model } from 'mongoose';

// * DTOs
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

// * Entities
import { Carrier } from './entities/carrier.entity';

//* Modules
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class CarriersService {
  constructor(
    @InjectModel(Carrier.name)
    private readonly carrierModel: Model<Carrier>,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async create(createCarrierDto: CreateCarrierDto, userId?: string) {
    try {
      // If userId is provided, set it in the DTO
      if (userId) {
        createCarrierDto.userId = userId;
      }
      const carrierCreated = await this.carrierModel.create(createCarrierDto);
      return carrierCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const carriers = await this.carrierModel
        .find()
        .populate('user', 'name lastName1 lastName2 phone email');
      return carriers;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const carrier = await this.carrierModel
        .findById(id)
        .populate('user', 'name lastName1 lastName2 phone email');
      if (!carrier) throw new Error('Carrier not found');
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
      if (!carrierUpdated) throw new Error('Carrier not found');
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
      if (!carrierDeleted) throw new Error('Carrier not found');
      return {
        message: 'Carrier deleted',
        carrierDeleted,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
