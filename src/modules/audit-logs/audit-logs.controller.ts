// Objective: Implement the controller for the audit logs module

//* NestJS modules
import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// * Services
import { AuditLogsService } from './audit-logs.service';

// * Entities
import { AuditLog } from './entities/audit-log.entity';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}
  @Get()
  @ApiProperty({
    description: 'Get all audit logs',
    type: [AuditLog],
  })
  findAll() {
    return this.auditLogsService.findAll();
  }
}
