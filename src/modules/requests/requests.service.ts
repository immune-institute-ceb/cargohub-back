import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Request } from './entities/request.entity';
import { CreateRequestDto, UpdateRequestDto } from './dto';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name)
    private readonly requestModel: Model<Request>,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    try {
      const request = await this.requestModel.create(createRequestDto);
      return request;
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.requestModel.find();
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
      return {
        message: 'Request deleted successfully',
      };
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
