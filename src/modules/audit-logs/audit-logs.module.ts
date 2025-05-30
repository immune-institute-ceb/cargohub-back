import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { CommonModule } from '@common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './entities/audit-log.entity';

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
