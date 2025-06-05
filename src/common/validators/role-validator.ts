// Description: Custom validator to ensure that the property is required if a specific role is included in the roles array.
import { ValidRoles } from '@modules/auth/interfaces';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsRequiredIfRoleConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown, args: ValidationArguments) {
    const object = args.object as Record<string, unknown>;
    const requiredRole = args.constraints[0];
    return !(object.roles?.includes(requiredRole) && !value);
  }

  // If the validation fails, this message will be returned.
  defaultMessage(args: ValidationArguments) {
    const requiredRole = args.constraints[0];
    return `${args.property} is required when role includes "${requiredRole}"`;
  }
}

export function IsRequiredIfRole(
  role: ValidRoles,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [role],
      validator: IsRequiredIfRoleConstraint,
    });
  };
}
