// Objective: Implement the module for the facturacion entity.

//* NestJS modules
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

//* Services
import { BillingService } from './billing.service';

//* Controllers
import { BillingController } from './billing.controller';

//* Entities
import { Billing, BillingSchema } from './entities/billing.entity';

//* Modules
import { CommonModule } from '@common/common.module';
import { RoutesModule } from '@modules/rutas/route.module';
import { RequestsModule } from '@modules/requests/requests.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';

@Module({
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
  imports: [
    CommonModule,
    ConfigModule,
    AuditLogsModule,
    forwardRef(() => RoutesModule),
    forwardRef(() => RequestsModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([
      {
        name: Billing.name,
        schema: BillingSchema,
      },
    ]),
  ],
})
export class BillingModule {}
