// Objective: This service periodically cleans up unverified users and their associated clients and carriers from the database.

//* NestJs Modules
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

//* External Modules
import { Model } from 'mongoose';

//* Entities
import { User } from '@modules/users/entities/user.entity';
import { Carrier } from '@modules/carriers/entities/carrier.entity';
import { Client } from '@modules/clients/entities/client.entity';
import { AuditLog } from '@modules/audit-logs/entities/audit-log.entity';

// * Interfaces
import { ValidRoles } from '@modules/auth/interfaces';
import { AuditLogLevel } from '@modules/audit-logs/interfaces/log-level.interface';
import { AuditLogContext } from '@modules/audit-logs/interfaces/context-log.interface';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Carrier.name)
    private readonly carrierModel: Model<Carrier>,
    @InjectModel(Client.name)
    private readonly clientModel: Model<Client>,
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLog>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const expirationMinutes = 15;
    const expirationDate = new Date(Date.now() - expirationMinutes * 60 * 1000);

    // Find unverified users created more than 15 minutes ago
    const unverifiedUsers = await this.userModel.find({
      emailVerified: false,
      roles: { $in: [ValidRoles.carrier, ValidRoles.client] },
      createdAt: { $lt: expirationDate },
    });

    let deletedUsers = 0;
    let deletedClients = 0;
    let deletedCarriers = 0;

    // Iterate over unverified users and delete them along with their clients and carriers
    for (const user of unverifiedUsers) {
      if (user.clientId) {
        const result = await this.clientModel.deleteOne({ _id: user.clientId });
        if (result.deletedCount) deletedClients++;
      }

      if (user.carrierId) {
        const result = await this.carrierModel.deleteOne({
          _id: user.carrierId,
        });
        if (result.deletedCount) deletedCarriers++;
      }

      const result = await this.userModel.deleteOne({ _id: user._id });
      if (result.deletedCount) deletedUsers++;
    }

    // Log the cleanup action
    if (deletedUsers > 0 || deletedClients > 0 || deletedCarriers > 0) {
      this.logger.log(
        `Deleted ${deletedUsers} unverified users, ${deletedClients} clients, and ${deletedCarriers} carriers.`,
      );

      await this.auditLogModel.create({
        level: AuditLogLevel.info,
        context: AuditLogContext.system,
        message: `Cleaned up ${deletedUsers} unverified users, ${deletedClients} clients, and ${deletedCarriers} carriers.`,
      });
    }
  }
}
