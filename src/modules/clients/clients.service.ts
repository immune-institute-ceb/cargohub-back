// Objective: Implement the service of the clients module to manage client entities.

//* NestJS modules
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// * External modules
import { Model, Types } from 'mongoose';

// * DTOs
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

// * Entities
import { Client } from './entities/client.entity';

// * Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { Requests } from '@modules/requests/entities/request.entity';
import { RequestsService } from '@modules/requests/requests.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<Client>,
    private readonly exceptionsService: ExceptionsService,
    @Inject(forwardRef(() => RequestsService))
    private readonly requestsService: RequestsService,
  ) {}
  async create(createClientDto: CreateClientDto, userId: Types.ObjectId) {
    try {
      // If userId is provided, set it in the DTO

      const clientCreated = await this.clientModel.create({
        ...createClientDto,
        user: userId,
      });
      if (!clientCreated) {
        throw new NotFoundException('Client could not be created');
      }
      return clientCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const clients = await this.clientModel
        .find()
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('requests');
      if (!clients || clients.length === 0) {
        throw new NotFoundException('No clients found');
      }
      return clients;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientModel
        .findById(id)
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('requests');
      if (!client) throw new NotFoundException('Client not found');
      return client;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findDuplicateClient(
    companyCIF: string,
    companyName: string,
    companyAddress: string,
  ) {
    try {
      const client = await this.clientModel.findOne({
        companyCIF,
        companyName,
        companyAddress,
      });
      return client;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const { ...update } = updateClientDto;
      const clientUpdated = await this.clientModel.findOneAndUpdate(
        { _id: id },
        update,
        {
          new: true,
        },
      );
      if (!clientUpdated) throw new NotFoundException('Client not found');
      return {
        message: 'Client updated',
        clientUpdated,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      console.log(id);
      const client = await this.clientModel.findById(id);
      if (!client) throw new NotFoundException('Client not found');
      // remove requests associated with the client
      await this.requestsService.removeRequestsByClientId(id);
      // remove the client
      const deletedClient = await this.clientModel.findByIdAndDelete(id);
      if (!deletedClient)
        throw new NotFoundException('Client could not be deleted');

      return {
        message: 'Client deleted',
        deletedClient,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOneByUserId(userId: string): Promise<Client> {
    try {
      const client = await this.clientModel
        .findOne({ user: userId })
        .populate('user', 'name lastName1 lastName2 phone email')
        .populate('requests');
      if (!client) throw new NotFoundException('Client not found');
      return client;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async addRequestToClient(clientId: string, request: Requests) {
    try {
      const clientWithRequest = await this.clientModel
        .findByIdAndUpdate(
          clientId,
          { $addToSet: { requests: request } },
          { new: true },
        )
        .populate('user', 'name lastName1 lastName2 phone email');
      if (!clientWithRequest) throw new NotFoundException('Client not found');
      return {
        message: 'Request added to client successfully',
        clientWithRequest,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async removeRequestFromClient(clientId: string, requestId: string) {
    try {
      const client = await this.clientModel.findByIdAndUpdate(
        clientId,
        { $pull: { requests: requestId } },
        { new: true },
      );
      if (!client) throw new NotFoundException('Client not found');
      return {
        message: 'Request removed from client successfully',
        client,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
