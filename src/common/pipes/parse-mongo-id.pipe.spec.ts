import { BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { ParseMongoIdPipe } from './parse-mongo-id.pipe';

describe('ParseMongoIdPipe', () => {
  const pipe = new ParseMongoIdPipe();
  const metadata: ArgumentMetadata = { type: 'param', data: 'id' };

  it('returns the id when valid', () => {
    const id = '507f1f77bcf86cd799439011';
    expect(pipe.transform(id, metadata)).toBe(id);
  });

  it('throws when id is invalid', () => {
    expect(() => pipe.transform('invalid', metadata)).toThrow(BadRequestException);
  });

  it('throws when id is numeric', () => {
    expect(() => pipe.transform('123', metadata)).toThrow(BadRequestException);
  });

  it('accepts another valid id', () => {
    const id = '64b22e4fd5f3b9e8a9c5b1a2';
    expect(pipe.transform(id, metadata)).toBe(id);
  });

  it('throws when id is empty', () => {
    expect(() => pipe.transform('', metadata)).toThrow(BadRequestException);
  });
});
