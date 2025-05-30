import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AuditLog } from './entities/audit-log.entity';
import { Model } from 'mongoose';
import { ExceptionsService } from '@common/exceptions/exceptions.service';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
    private readonly exceptionsService: ExceptionsService,
  ) {}
  async create(createAuditLogDto: CreateAuditLogDto) {
    try {
      await this.auditLogModel.create(createAuditLogDto);
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }

  findAll() {
    try {
      return this.auditLogModel.find().sort({ createdAt: -1 });
    } catch (error) {
      this.exceptionsService.handleDBExceptions(error);
    }
  }
}
