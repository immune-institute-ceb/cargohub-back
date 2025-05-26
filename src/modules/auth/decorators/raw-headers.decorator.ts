// Purpose: Custom decorator to extract raw headers from the request object.
// Usage: @RawHeaders()
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get raw headers from request.
 * @returns {string[]} Raw headers
 */
export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;
  },
);
