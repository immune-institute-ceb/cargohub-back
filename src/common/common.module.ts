// Common Module to export ExceptionsService.
import { Module } from '@nestjs/common';
import { ExceptionsService } from './exceptions/exceptions.service';

@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class CommonModule {}
