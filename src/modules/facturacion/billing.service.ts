// Objective: Implement the service to manage the user entity.

//* NestJS modules
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { RegisterBillingDto } from './dto/register-billing.dto';

//* Entities
import { Billing } from './entities/billing.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { Requests } from '@modules/requests/entities/request.entity';
import { BillingStatus } from './interfaces/billing-status.interface';
import { RoutesService } from '@modules/rutas/route.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name)
    private readonly billingModel: Model<Billing>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => RoutesService))
    private readonly routesService: RoutesService,
  ) {}

  async createBillingFromRequest(request: Requests) {
    try {
      const registerBillingDto: RegisterBillingDto = {
        requestId: request._id,
        clientId: request.clientId,
        billingAmount: await this.calcAmount(request.routeId.toString()),
        issueDate: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Due date is one month from issue date
        status: BillingStatus.pending,
      };
      const billingCreated = await this.billingModel.create(registerBillingDto);
      if (!billingCreated) {
        throw new NotFoundException('Billing could not be created');
      }
      return billingCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateBillingStatus(billingId: string, status: BillingStatus) {
    try {
      const updatedBilling = await this.billingModel.findByIdAndUpdate(
        billingId,
        { status },
        { new: true },
      );
      if (!updatedBilling) {
        throw new NotFoundException('Billing not found');
      }
      return updatedBilling;
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

  async calcAmount(routeId: string) {
    try {
      const route = await this.routesService.findRouteById(routeId);
      if (!route) throw new NotFoundException('Route not found');
      const distance = route.distance;
      const ratePerKm = 10;
      return distance * ratePerKm;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
