import { forwardRef, Module } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Truck, TruckSchema } from './entities/truck.entity';
import { CommonModule } from '@common/common.module';
import { CarriersModule } from '@modules/carriers/carriers.module';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
  imports: [
    CommonModule,
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
