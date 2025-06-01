// Objective: Implement the service to manage the user entity.

//* NestJS modules
import {
  BadRequestException,
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
import { Requests } from '@modules/requests/entities/request.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { RoutesService } from '@modules/rutas/route.service';
import { RequestsService } from '@modules/requests/requests.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

// * Interfaces
import { BillingStatus } from './interfaces/billing-status.interface';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';
import {
  RequestPackageType,
  RequestPriority,
  RequestStatus,
} from '@modules/requests/interfaces';

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
        billingAmount: await this.calcAmount(
          request.routeId.toString(),
          request,
        ),
        issueDate: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Due date is one month from issue date
        status: BillingStatus.pending,
      };
      const billingCreated = await this.billingModel.create(registerBillingDto);
      if (!billingCreated) {
        throw new BadRequestException('Billing could not be created');
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.billingService,
        message: `Billing created with status: ${BillingStatus.pending}`,
        meta: {
          billingId: billingCreated._id.toString(),
          clientId: billingCreated.clientId.toString(),
          requestId: billingCreated.requestId.toString(),
        },
      });
      return billingCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateBillingStatus(billingId: string, status: BillingStatus) {
    try {
      const billing = await this.billingModel.findById(billingId);
      if (!billing) throw new NotFoundException('Billing not found');
      if (billing.status === status) {
        throw new BadRequestException(`Billing already has status: ${status}`);
      }

      if (
        billing.status === BillingStatus.paid ||
        billing.status === BillingStatus.cancelled
      ) {
        throw new BadRequestException(
          `Billing with status ${billing.status} cannot be updated`,
        );
      }

      if (status === BillingStatus.paid) {
        const updatedRequest = await this.requestsService.updateStatus(
          billing.requestId.toString(),
          RequestStatus.completed,
        );
        console.log(updatedRequest);
        if (updatedRequest) {
          billing.paidDate = new Date();
          billing.status = status;
          const updatedBilling = await billing.save();
          await this.auditLogsService.create({
            level: AuditLogLevel.info,
            context: AuditLogContext.billingService,
            message: `Billing marked as paid`,
            meta: {
              billingId,
              requestId: billing.requestId.toString(),
              clientId: billing.clientId.toString(),
            },
          });
          return updatedBilling;
        }
      }

      billing.status = status;
      await billing.save();
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.billingService,
        message: `Billing status updated to ${status}`,
        meta: {
          billingId,
          clientId: billing.clientId.toString(),
          requestId: billing.requestId.toString(),
        },
      });
      return billing;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async deleteBilling(id: string) {
    try {
      const billing = await this.billingModel.findOneAndDelete({ _id: id });
      if (billing && billing.requestId) {
        const request = await this.requestsService.findOne(
          billing.requestId.toString(),
        );
        request.status = RequestStatus.inProgress;
        await request.save();
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.billingService,
        message: `Billing deleted`,
        meta: {
          billingId: id,
          requestId: billing?.requestId?.toString(),
          clientId: billing?.clientId?.toString(),
        },
      });
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
        await this.auditLogsService.create({
          level: AuditLogLevel.warn,
          context: AuditLogContext.billingService,
          message: `Billing deleted by request ID`,
          meta: {
            billingId: billing._id.toString(),
            requestId: requestId.toString(),
            clientId: billing.clientId.toString(),
          },
        });
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

  async getMensualBilling() {
    try {
      const currentMonth = new Date().getMonth();
      const billings = (await this.getBillingWithFullPopulate(
        this.billingModel.find({
          issueDate: {
            $gte: new Date(new Date().setMonth(currentMonth, 1)),
            $lt: new Date(new Date().setMonth(currentMonth + 1, 1)),
          },
        }),
      )) as Billing[];
      const totalAmount = billings.reduce(
        (acc, billing) => acc + billing.billingAmount,
        0,
      );

      return totalAmount;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async calcAmount(routeId: string, request: Requests) {
    try {
      const route = await this.routesService.findRouteById(routeId);
      if (!route) throw new NotFoundException('Route not found');
      const distance = route.distance;
      let ratePerKm = 0.5;
      if (request.packageType === RequestPackageType.box) {
        ratePerKm = 0.3; // Discounted rate for box packages
      } else if (request.packageType === RequestPackageType.pallet) {
        ratePerKm = 0.7; // Increased rate for pallet packages
      }
      if (
        request.priority === RequestPriority.high ||
        request.priority === RequestPriority.urgent
      ) {
        ratePerKm *= 1.2; // Increase rate by 20% for high priority
      }
      if (request.priority === RequestPriority.low) {
        ratePerKm *= 0.9; // Decrease rate by 10% for low priority
      }
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
