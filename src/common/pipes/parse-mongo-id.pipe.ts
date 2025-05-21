// Code for ParseMongoIdPipe, a pipe that checks if a given string is a valid mongoId
// and throws a BadRequestException if it is not.
// The pipe is used in the controller to validate the mongoId passed in the request.
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid mongoId`);
    }
    return value;
  }
}
