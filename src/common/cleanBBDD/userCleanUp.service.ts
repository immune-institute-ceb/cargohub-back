import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@modules/users/entities/user.entity';
import { Carrier } from '@modules/carriers/entities/carrier.entity';
import { Client } from '@modules/clients/entities/client.entity';

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
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    const expirationMinutes = 15;
    const expirationDate = new Date(Date.now() - expirationMinutes * 60 * 1000);

    const unverifiedUsers = await this.userModel.find({
      emailVerified: false,
      createdAt: { $lt: expirationDate },
    });

    let deletedUsers = 0;
    let deletedClients = 0;
    let deletedCarriers = 0;

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

    this.logger.log(
      `Deleted ${deletedUsers} unverified users, ${deletedClients} clients, and ${deletedCarriers} carriers.`,
    );
  }
}
