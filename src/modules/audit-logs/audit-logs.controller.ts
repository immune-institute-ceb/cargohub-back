// Objective: Implement the controller for the audit logs module

//* NestJS modules
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

// * Decorators
import { Auth } from '@modules/auth/decorators';

// * Services
import { AuditLogsService } from './audit-logs.service';

// * Entities
import { AuditLog } from './entities/audit-log.entity';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}
  @Get()
  @ApiProperty({
    description: 'Get all audit logs',
    type: [AuditLog],
  })
  @ApiBearerAuth()
  @Auth(ValidRoles.admin, ValidRoles.adminManager)
  findAll() {
    return this.auditLogsService.findAll();
  }
}
