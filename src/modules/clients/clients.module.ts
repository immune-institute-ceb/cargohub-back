// Objective: Implement the module to manage clients in the application.

//* NestJS modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// * Services
import { ClientsService } from './clients.service';

// * Controllers
import { ClientsController } from './clients.controller';

// * Entities
import { Client, ClientSchema } from './entities/client.entity';

// * Modules
import { CommonModule } from '@common/common.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
  ],
})
export class ClientsModule {}
