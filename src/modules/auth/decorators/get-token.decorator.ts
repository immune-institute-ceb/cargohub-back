// Purpose: Custom decorator to extract token from request header.
// Usage: @GetTokenFromHeader()
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Get token from request header.
 * @returns {string} Token
 */
export const GetTokenFromHeader = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization.split(' ')[1];
    if (!token)
      throw new InternalServerErrorException('Token not found (request)');
    return token;
  },
);
