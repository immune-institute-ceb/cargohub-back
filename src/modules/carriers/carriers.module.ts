// Objective: Implement the module to manage carriers in the application.

//* NestJS modules
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//* Services
import { CarriersService } from './carriers.service';

// * Controllers
import { CarriersController } from './carriers.controller';

// * Entities
import { Carrier, CarrierSchema } from './entities/carrier.entity';

//* Modules
import { CommonModule } from '@common/common.module';
import { TrucksModule } from '@modules/trucks/trucks.module';
import { User, UserSchema } from '@modules/users/entities/user.entity';

@Module({
  controllers: [CarriersController],
  providers: [CarriersService],
  exports: [CarriersService],
  imports: [
    CommonModule,
    forwardRef(() => TrucksModule),
    MongooseModule.forFeature([
      {
        name: Carrier.name,
        schema: CarrierSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class CarriersModule {}
