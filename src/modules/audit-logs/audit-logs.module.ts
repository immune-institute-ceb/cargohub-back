// Objective: Implement the module for the audit logs feature in a NestJS application.

//* NestJS modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// * Services
import { AuditLogsService } from './audit-logs.service';

// * Controllers
import { AuditLogsController } from './audit-logs.controller';

// * Entities
import { AuditLog, AuditLogSchema } from './entities/audit-log.entity';

// * Modules
import { CommonModule } from '@common/common.module';

@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: AuditLog.name,
        schema: AuditLogSchema,
      },
    ]),
  ],
})
export class AuditLogsModule {}
