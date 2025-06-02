// Exception service to handle exceptions and errors
// This service is used to handle exceptions and errors that are thrown by the application.
import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ExceptionsService {
  private readonly logger = new Logger(ExceptionsService.name);

  handleDBExceptions(error: any): never {
    // If the error is an instance of BadRequestException, throw the error, as it is already handled.
    // It shows the error message to the user.
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof UnauthorizedException
    )
      throw error;

    // Logg the error message to the console and the log file.
    this.logger.error(error.message);

    // Other errors.
    console.log(error);
    if (error.code === 11000) {
      throw new BadRequestException('Duplicate key error: ' + error.message);
    }

    if (error.name === 'ValidationError') {
      throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException(error);
  }
}
