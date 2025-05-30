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
import { Model, Types } from 'mongoose';

//* DTOs
import { RegisterBillingDto } from './dto/register-billing.dto';

//* Entities
import { Billing } from './entities/billing.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { Requests } from '@modules/requests/entities/request.entity';
import { BillingStatus } from './interfaces/billing-status.interface';
import { RoutesService } from '@modules/rutas/route.service';
import { RequestsService } from '@modules/requests/requests.service';
import { RequestStatus } from '@modules/requests/interfaces/request-status.interface';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(Billing.name)
    private readonly billingModel: Model<Billing>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => RoutesService))
    private readonly routesService: RoutesService,
    @Inject(forwardRef(() => RequestsService))
    private readonly requestsService: RequestsService,
    private readonly auditLogsService: AuditLogsService,
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
      if (status === BillingStatus.paid) {
        await this.requestsService.updateStatus(
          updatedBilling.requestId.toString(),
          RequestStatus.completed,
        );
        updatedBilling.paidDate = new Date();
      }
      return updatedBilling;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteBilling(id: string) {
    try {
      const billing = await this.billingModel.findOneAndDelete({ _id: id });
      if (billing && billing.requestId) {
        await this.requestsService.updateStatus(
          billing.requestId.toString(),
          RequestStatus.inProgress,
        );
      }
      return { message: 'Billing deleted' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteBillingByRequestId(requestId: Types.ObjectId) {
    try {
      console.log(requestId);
      const billing = await this.billingModel.findOne({ requestId });
      console.log(billing);
      if (billing) {
        await this.billingModel.deleteOne({ requestId });
      }
      return { message: 'Billing deleted for request' };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllBillings() {
    try {
      const billings = (await this.getBillingWithFullPopulate(
        this.billingModel.find(),
      )) as Billing[];
      if (billings.length === 0)
        throw new NotFoundException('No billings found');
      return billings;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findBillingById(id: string) {
    try {
      const billing = await this.getBillingWithFullPopulate(
        this.billingModel.findById(id),
      );
      if (!billing) throw new NotFoundException('Billing not found');
      return billing;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findBillingsByClientId(clientId: string) {
    try {
      const objectId = new Types.ObjectId(clientId);
      const billings = (await this.getBillingWithFullPopulate(
        this.billingModel.find({ clientId: objectId }),
      )) as Billing[];
      if (billings.length === 0) {
        throw new NotFoundException(
          `No billings found for client ID: ${clientId}`,
        );
      }
      return billings;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findBillingsByStatus(status: string) {
    try {
      const billings = (await this.getBillingWithFullPopulate(
        this.billingModel.find({ status }),
      )) as Billing[];
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

  private getBillingWithFullPopulate(
    query: ReturnType<
      typeof this.billingModel.find | typeof this.billingModel.findById
    >,
  ) {
    return query
      .populate({
        path: 'requestId',
        select: 'routeId',
        populate: {
          path: 'routeId',
          select: 'origin destination distance estimatedTime carrier',
          populate: {
            path: 'carrier',
            select: 'dni licenseNumber truck',
            populate: {
              path: 'truck',
              select: 'licensePlate carModel capacity fuelType',
            },
          },
        },
      })
      .populate('clientId', 'companyName companyCIF companyAddress');
  }
}
