// Objective: Implement the Requests module for handling requests in the application.

//* NestJS modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//* Services
import { RequestsService } from './requests.service';

//* Controllers
import { RequestsController } from './requests.controller';

//* Entities
import { Request, RequestSchema } from './entities/request.entity';

// * Modules
import { CommonModule } from '@common/common.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  imports: [
    CommonModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Request.name,
        schema: RequestSchema,
      },
    ]),
  ],
})
export class RequestsModule {}
