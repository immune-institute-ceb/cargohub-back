// Objective: Implement the module to manage trucks in the application.
// * NestJS modules
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// * Services
import { TrucksService } from './trucks.service';

// * Controllers
import { TrucksController } from './trucks.controller';

// * Entities
import { Truck, TruckSchema } from './entities/truck.entity';

// * Modules
import { CommonModule } from '@common/common.module';
import { CarriersModule } from '@modules/carriers/carriers.module';
import { AuditLogsModule } from '@modules/audit-logs/audit-logs.module';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
  imports: [
    CommonModule,
    AuditLogsModule,
    forwardRef(() => CarriersModule),
    MongooseModule.forFeature([
      {
        name: Truck.name,
        schema: TruckSchema,
      },
    ]),
  ],
})
export class TrucksModule {}
