// Purpose: Decorator to get the user from the request.
// Usage: @GetUser()
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

/**
 * Get user from request.
 * @returns {User} User
 */
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as User;

  if (!user) throw new InternalServerErrorException('User not found (request)');

  return !data ? user : user[data];
});
