// Objective: Implement the service for the audit logs module

//* NestJS modules
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

//* External modules
import { Model } from 'mongoose';

//* DTOs
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

// * Entities
import { AuditLog } from './entities/audit-log.entity';

// * Services
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
