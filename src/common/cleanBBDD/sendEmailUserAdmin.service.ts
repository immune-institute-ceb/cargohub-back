// Objective: This service periodically cleans up unverified users and their associated clients and carriers from the database.

//* NestJs Modules
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

//* External Modules
import { Model } from 'mongoose';

//* Entities
import { User } from '@modules/users/entities/user.entity';
import { AuditLog } from '@modules/audit-logs/entities/audit-log.entity';

// * Services
import AuthService from '@modules/auth/auth.service';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';

@Injectable()
export class SendEmailUserAdminService {
  private readonly logger = new Logger(SendEmailUserAdminService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
    private readonly authService: AuthService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const expirationMinutes = 15;
    const expirationDate = new Date(Date.now() - expirationMinutes * 60 * 1000);

    // Find unverified admin users created more than 15 minute ago
    const unverifiedAdmins = await this.userModel.find({
      emailVerified: false,
      roles: { $in: [ValidRoles.admin, ValidRoles.adminManager] },
      createdAt: { $lt: expirationDate },
    });
    for (const user of unverifiedAdmins) {
      try {
        await this.authService.sendConfirmationEmail(user);
        this.logger.log(`Verification email sent to ${user.email}`);
        await this.auditLogModel.create({
          level: AuditLogLevel.info,
          context: AuditLogContext.system,
          message: `Verification emails sent to ${unverifiedAdmins.length} admin users.`,
        });
      } catch (err) {
        this.logger.error(
          `Failed to send email to ${user.email}: ${err.message}`,
        );
      }
    }
  }
}
