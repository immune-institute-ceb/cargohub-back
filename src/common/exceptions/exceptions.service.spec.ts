import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';

describe('ExceptionsService', () => {
  let service: ExceptionsService;

  beforeEach(() => {
    service = new ExceptionsService();
  });

  it('rethrows known exceptions', () => {
    const error = new BadRequestException('bad');
    expect(() => service.handleDBExceptions(error)).toThrow(BadRequestException);
  });

  it('converts duplicate errors to BadRequestException', () => {
    try {
      service.handleDBExceptions({ code: 11000, message: 'dup' });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('wraps unknown errors', () => {
    try {
      service.handleDBExceptions(new Error('unknown'));
    } catch (err) {
      expect(err).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('passes validation errors as BadRequestException', () => {
    try {
      service.handleDBExceptions({ name: 'ValidationError', message: 'val' });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('rethrows not found exceptions', () => {
    const error = new NotFoundException('not found');
    expect(() => service.handleDBExceptions(error)).toThrow(NotFoundException);
  });
});
