// Description: Custom validator to ensure that the provided roles are consistent with the presence of clientData and carrierData.
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ValidRoles } from '@modules/auth/interfaces';

@ValidatorConstraint({ async: false })
export class RoleDataConsistencyConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: any, args: ValidationArguments): boolean {
    const object = args.object as any;

    // Ensure that roles is an array and has a default value if not provided
    const roles: ValidRoles[] = object.roles || [];
    const hasClientRole = roles.includes(ValidRoles.client);
    const hasCarrierRole = roles.includes(ValidRoles.carrier);

    if (!hasClientRole && object.clientData !== undefined) {
      return false;
    }

    if (!hasCarrierRole && object.carrierData !== undefined) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as any;
    const roles = object.roles || [];
    // Ensure that roles is an array and has a default value if not provided
    const hasClientData = object.clientData !== undefined;
    const hasCarrierData = object.carrierData !== undefined;

    return (
      `Data inconsistency: roles = [${roles.join(', ')}], ` +
      `clientData = ${hasClientData ? 'provided' : 'not provided'}, ` +
      `carrierData = ${hasCarrierData ? 'provided' : 'not provided'}. ` +
      `clientData is only allowed if roles include 'client'; ` +
      `carrierData is only allowed if roles include 'carrier'.`
    );
  }
}

export function RoleDataConsistency(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'RoleDataConsistency',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RoleDataConsistencyConstraint,
    });
  };
}
