// Objective: Implement the service for managing trucks in the application.
// * NestJS modules
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// * External modules
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// * DTOs
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';

// * Entities
import { Truck } from './entities/truck.entity';

// * Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { CarriersService } from '@modules/carriers/carriers.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

// * Interfaces
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';
import { TruckStatus } from './interfaces/truck-status.interface';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectModel(Truck.name)
    private readonly truckModel: Model<Truck>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => CarriersService))
    private readonly carriersService: CarriersService,
    private readonly auditLogsService: AuditLogsService,
  ) {}
  async create(createTruckDto: CreateTruckDto) {
    try {
      const truckCreated = await this.truckModel.create(createTruckDto);
      if (!truckCreated) {
        throw new BadRequestException('Truck could not be created');
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.trucksService,
        message: `Truck created successfully`,
        meta: {
          truckId: truckCreated._id.toString(),
        },
      });
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
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.trucksService,
        message: `Truck updated successfully`,
        meta: {
          truckId: truckUpdated._id.toString(),
        },
      });
      return truckUpdated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateTruckStatus(id: string, status: TruckStatus, from: string) {
    try {
      const truck = await this.truckModel.findById(id);
      if (truck) {
        if (from !== 'CarriersService') {
          if (
            status === TruckStatus.maintenance &&
            truck.status !== TruckStatus.available
          ) {
            throw new BadRequestException(
              'Truck can only enter maintenance from available status',
            );
          }

          if (
            status === TruckStatus.available &&
            truck.status !== TruckStatus.maintenance
          ) {
            throw new BadRequestException(
              'Truck can only return to available status from maintenance',
            );
          }

          if (truck.status === status) {
            throw new BadRequestException(
              `Truck is already in ${status} status`,
            );
          }
        }
      }

      const truckUpdated = await this.truckModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (truckUpdated) {
        await this.auditLogsService.create({
          level: AuditLogLevel.info,
          context: AuditLogContext.trucksService,
          message: `Truck status updated to ${status}`,
          meta: {
            truckId: truckUpdated._id.toString(),
            status,
          },
        });

        return {
          message: 'Truck status updated successfully',
          truck: truckUpdated,
        };
      }
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    try {
      const truckDeleted = await this.truckModel.findByIdAndDelete(id);
      if (!truckDeleted) throw new NotFoundException('Truck not found');
      await this.carriersService.unassignTruckDeleted(id, user);
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.trucksService,
        message: `Truck deleted successfully`,
        meta: {
          truckId: truckDeleted._id.toString(),
        },
      });
      return {
        message: 'Truck deleted successfully',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
