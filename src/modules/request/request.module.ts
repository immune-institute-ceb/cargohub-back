import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RequestsService } from './request.service';
import { RequestsController } from './request.controller';
import { Request, RequestSchema } from './entities/request.entity';
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
