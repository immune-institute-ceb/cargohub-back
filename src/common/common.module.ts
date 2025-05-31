// Common Module to export ExceptionsService.
//* NestJs Modules
import { Module } from '@nestjs/common';

//* Services
import { ExceptionsService } from './exceptions/exceptions.service';

@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class CommonModule {}
