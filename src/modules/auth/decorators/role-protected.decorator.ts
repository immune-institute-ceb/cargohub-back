// Purpose: Decorator for role protection.
// Usage: @RoleProtected('admin', 'user')
import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';

/**
 * Role protected decorator.
 * @param args Valid roles
 * @returns {void}
 */
export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
