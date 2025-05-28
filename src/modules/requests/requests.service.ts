// Objective: Implement the service to manage requests in a NestJS application.

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
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

//* Entities
import { Request } from './entities/request.entity';

//* Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { User } from '@modules/users/entities/user.entity';
import { ClientsService } from '@modules/clients/clients.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<Request>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
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
        throw new NotFoundException('Request already exists for this client');
      }
      const request = await this.requestModel.create(createRequestDto);
      if (!request) {
        throw new NotFoundException('Request could not be created');
      } else if (client.requests?.includes(request._id)) {
        await this.requestModel.findByIdAndDelete(request._id);
        throw new NotFoundException('Request already exists for this client');
      }
      console.log(request);
      await this.clientsService.addRequestToClient(
        client._id.toString(),
        request,
      );
      request.clientId = client._id.toString();
      await request.save();

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
        clientId: client._id.toString(),
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

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    try {
      const request = await this.requestModel.findByIdAndUpdate(
        id,
        updateRequestDto,
        { new: true },
      );

      if (!request) throw new NotFoundException('Request not found');

      return request;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.requestModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Request not found');
      await this.clientsService.removeRequestFromClient(
        result.clientId.toString(),
        id,
      );
      return {
        message: 'Request deleted successfully',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
