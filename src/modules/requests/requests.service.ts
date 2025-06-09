// Objective: Implement the service to manage requests in a NestJS application.

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
import { Model } from 'mongoose';

//* DTOs
import { CreateRequestDto } from './dto/create-request.dto';

//* Entities
import { Requests } from './entities/request.entity';
import { User } from '@modules/users/entities/user.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { ClientsService } from '@modules/clients/clients.service';
import { RoutesService } from '@modules/rutas/route.service';
import { BillingService } from '@modules/facturacion/billing.service';
import { AuditLogsService } from '@modules/audit-logs/audit-logs.service';

//* Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { RouteStatus } from '@modules/rutas/interfaces/route-status.interface';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { ClientsStatus } from '@modules/clients/interfaces/active-clients.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';
import { RequestStatus } from './interfaces';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Requests.name)
    private readonly requestModel: Model<Requests>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    @Inject(forwardRef(() => RoutesService))
    private readonly routesService: RoutesService,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(createRequestDto: CreateRequestDto, user: User) {
    try {
      const client = await this.clientsService.findOneByUserId(
        user._id.toString(),
      );
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      const existingRequest = await this.requestModel.findOne({
        clientId: client._id.toString(),
        ...createRequestDto,
      });
      if (existingRequest) {
        throw new BadRequestException('Request already exists for this client');
      }
      if (client.status === ClientsStatus.inactive) {
        throw new BadRequestException(
          'Client is inactive and cannot create new requests',
        );
      }
      const request = await this.requestModel.create(createRequestDto);
      if (!request) {
        throw new BadRequestException('Request could not be created');
      } else if (client.requests?.includes(request._id)) {
        await this.requestModel.findByIdAndDelete(request._id);
        throw new BadRequestException('Request already exists for this client');
      }
      const { clientWithRequest } =
        await this.clientsService.addRequestToClient(
          client._id.toString(),
          request,
        );
      if (!clientWithRequest) {
        throw new NotFoundException('Client not found after adding request');
      }
      request.clientId = client._id;
      await request.save();

      const routeCreated = await this.routesService.create(
        {
          origin: createRequestDto.origin,
          destination: createRequestDto.destination,
        },
        request,
      );
      if (!routeCreated) {
        throw new BadRequestException('Route could not be created');
      }
      request.routeId = routeCreated._id;
      await request.save();
      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.requestsService,
        message: `Request created for client ${client._id.toString()}`,
        meta: {
          requestId: request._id.toString(),
          clientId: client._id.toString(),
          userId: user._id.toString(),
        },
      });
      return request;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAllRequestsByClientId(clientId: string) {
    try {
      const client = await this.clientsService.findOne(clientId);
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      const requests = await this.requestModel.find({
        clientId: client._id,
      });
      if (!requests || requests.length === 0) {
        throw new NotFoundException('No requests found for this client');
      }
      return requests;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.requestModel.findById(id);
      if (!request) throw new NotFoundException('Request not found');
      return request;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getYearRequestsPendingCountByMonth() {
    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      const requests = await this.requestModel.aggregate([
        {
          $match: {
            status: RequestStatus.pending,
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const monthlyCounts = Array(12).fill(0);
      requests.forEach((req) => {
        monthlyCounts[req._id - 1] = req.count;
      });

      const allZero = monthlyCounts.every((count) => count === 0);
      return allZero ? [] : monthlyCounts;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getYearRequestsCompletedCountByMonth() {
    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

      const requests = await this.requestModel.aggregate([
        {
          $match: {
            status: RequestStatus.completed,
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month
        },
      ]);

      // Fill in months with zero counts
      const monthlyCounts = Array(12).fill(0);
      requests.forEach((req) => {
        monthlyCounts[req._id - 1] = req.count;
      });
      const allZero = monthlyCounts.every((count) => count === 0);
      return allZero ? [] : monthlyCounts;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async getRequestsStatusCount() {
    try {
      const requests = await this.requestModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            status: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      const statusCount = requests.reduce((acc, req) => {
        acc[req.status] = req.count;
        return acc;
      }, {});

      return {
        pending: statusCount[RequestStatus.pending] || 0,
        done: statusCount[RequestStatus.done] || 0,
        completed: statusCount[RequestStatus.completed] || 0,
        cancelled: statusCount[RequestStatus.cancelled] || 0,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async updateStatus(id: string, status: RequestStatus, user?: User) {
    try {
      const request = await this.requestModel.findById(id).lean();
      if (!request) {
        throw new NotFoundException('Request not found');
      }
      const client = await this.clientsService.findOne(
        request.clientId.toString(),
      );
      if (!client) {
        throw new NotFoundException('Client not found for this request');
      }
      if (!user?.roles.includes(ValidRoles.admin || ValidRoles.adminManager)) {
        if (request.clientId.toString() !== user?.clientId?._id?.toString()) {
          throw new BadRequestException(
            'You can only update requests for your own client',
          );
        }
      }
      if (client.status === ClientsStatus.inactive) {
        throw new BadRequestException(
          'Client is inactive and cannot update request status',
        );
      }
      if (
        status === RequestStatus.cancelled &&
        request.status !== RequestStatus.pending
      ) {
        throw new BadRequestException(
          'Request can only be cancelled if it is pending',
        );
      }

      if (request.status === status) {
        throw new BadRequestException('Request already has this status');
      }

      if (request.status === RequestStatus.completed) {
        throw new BadRequestException(
          'Request is already marked as completed and cannot be updated',
        );
      }

      if (status === RequestStatus.done || status === RequestStatus.completed) {
        const route = await this.routesService.findRouteById(
          request.routeId.toString(),
        );
        if (!route || route.status !== RouteStatus.done) {
          throw new BadRequestException(
            'Route must be done before request can be marked as done or completed',
          );
        }
      }

      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }, // returns updated document
      );

      if (!updatedRequest) {
        throw new NotFoundException('Request not found after update');
      }

      if (status === RequestStatus.done) {
        const billing =
          await this.billingService.createBillingFromRequest(updatedRequest);
        if (!billing) {
          throw new BadRequestException('Billing could not be created');
        }
      }

      await this.auditLogsService.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.requestsService,
        message: `Request status updated to ${status} for request ID ${id}`,
        meta: {
          requestId: id,
          userId: client.user?._id?.toString(),
          status,
        },
      });
      return {
        message: 'Request status updated successfully',
        updatedRequest,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.requestModel.findById(id);
      if (!result) throw new NotFoundException('Request not found');
      await this.clientsService.removeRequestFromClient(
        result.clientId.toString(),
        id,
      );
      await this.routesService.deleteRoute(result.routeId.toString());

      await this.billingService.deleteBillingByRequestId(result._id);

      const requestDeleted = await this.requestModel.findByIdAndDelete(id);
      if (!requestDeleted) {
        throw new BadRequestException('Request could not be deleted');
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.requestsService,
        message: `Request deleted successfully`,
        meta: {
          requestId: id,
        },
      });
      return {
        message: 'Request deleted successfully',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async removeRequestsByClientId(clientId: string) {
    try {
      const client = await this.clientsService.findOne(clientId);
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      const requests = await this.requestModel.find({
        clientId: client._id,
      });
      if (requests && requests.length > 0) {
        for (const request of requests) {
          await this.routesService.deleteRoute(request.routeId.toString());
          await this.billingService.deleteBillingByRequestId(request._id);
          const requestDeleted = await this.requestModel.findByIdAndDelete(
            request._id,
          );
          if (!requestDeleted) {
            throw new BadRequestException('Request could not be deleted');
          }
        }
      }
      await this.auditLogsService.create({
        level: AuditLogLevel.warn,
        context: AuditLogContext.requestsService,
        message: `All requests for client ${clientId} have been deleted`,
        meta: {
          clientId: clientId,
        },
      });
      return {
        message: 'All requests for the client have been deleted',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
