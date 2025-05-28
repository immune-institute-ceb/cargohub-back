// Objective: Implement the service to manage the user entity.

//* NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { RegisterBillingDto } from './dto/register-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

//* Entities
import { Billing } from './entities/billing.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name)
    private readonly billingModel: Model<Billing>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(registerBillingDto: RegisterBillingDto) {
    try {
      const billingCreated = await this.billingModel.create(registerBillingDto);
      return billingCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(billing: Billing, updateBillingDto: UpdateBillingDto) {
    try {
      const { ...update } = updateBillingDto;

      const billingUpdated = await this.billingModel.findOneAndUpdate(
        { _id: billing._id },
        update,
        {
          new: true,
        },
      );

      if (!billingUpdated) throw new NotFoundException('Billing not found');

      return billingUpdated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteBilling(billing: Billing) {
    try {
      await this.billingModel.findOneAndDelete({ _id: billing._id });
      return { message: 'Billing deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllBillings() {
    try {
      const billings = await this.billingModel.find();
      return billings;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findBillingById(id: string) {
    try {
      const billing = await this.billingModel.findById(id);
      if (!billing) throw new NotFoundException('Billing not found');
      return billing;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findBillingsByStatus(status: string) {
    try {
      const billings = await this.billingModel.find({ status });
      if (billings.length === 0) {
        throw new NotFoundException(`No billings found with status: ${status}`);
      }
      return billings;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
