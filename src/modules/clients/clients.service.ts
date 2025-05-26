import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './entities/client.entity';
import { Model } from 'mongoose';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<Client>,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async create(createClientDto: CreateClientDto, userId?: string) {
    try {
      // If userId is provided, set it in the DTO
      if (userId) {
        createClientDto.userId = userId;
      }
      const clientCreated = await this.clientModel.create(createClientDto);
      return clientCreated;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      const clients = await this.clientModel
        .find()
        .populate('user', 'name lastName1 lastName2 phone email');
      return clients;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const client = await this.clientModel
        .findById(id)
        .populate('user', 'name lastName1 lastName2 phone email');
      if (!client) throw new Error('Client not found');
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
      if (!clientUpdated) throw new Error('Client not found');
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
      if (!clientDeleted) throw new Error('Client not found');
      return {
        message: 'Client deleted',
        clientDeleted,
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
