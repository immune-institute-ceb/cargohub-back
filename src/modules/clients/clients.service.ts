// Objective: Implement the service of the clients module to manage client entities.

//* NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// * External modules
import { Model, ObjectId } from 'mongoose';

// * DTOs
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

// * Entities
import { Client } from './entities/client.entity';

// * Services
import { ExceptionsService } from '@common/exceptions/exceptions.service';
import { Request } from '@modules/requests/entities/request.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<Client>,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async create(createClientDto: CreateClientDto, userId: ObjectId) {
    try {
      // If userId is provided, set it in the DTO

      const clientCreated = await this.clientModel.create({
        ...createClientDto,
        user: userId,
      });
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
      const clientDeleted = await this.clientModel.findByIdAndDelete(id);
      if (!clientDeleted) throw new NotFoundException('Client not found');
      return {
        message: 'Client deleted',
        clientDeleted,
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

  async addRequestToClient(clientId: string, request: Request) {
    try {
      const client = await this.clientModel
        .findByIdAndUpdate(
          clientId,
          { $addToSet: { requests: request } },
          { new: true },
        )
        .populate('user', 'name lastName1 lastName2 phone email');
      if (!client) throw new NotFoundException('Client not found');
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async removeRequestFromClient(clientId: string, requestId: string) {
    try {
      const client = await this.clientModel
        .findByIdAndUpdate(
          clientId,
          { $pull: { requests: requestId } },
          { new: true },
        )
        .populate('user', 'name lastName1 lastName2 phone email');
      if (!client) throw new NotFoundException('Client not found');
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
