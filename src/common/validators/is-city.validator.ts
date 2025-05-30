// src/common/validators/is-city.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as cities from 'all-the-cities';

@ValidatorConstraint({ async: false })
export class IsCityConstraint implements ValidatorConstraintInterface {
  validate(cityName: string, args: ValidationArguments): boolean {
    if (typeof cityName !== 'string') return false;

    const normalized = cityName.trim().toLowerCase();

    const matches = cities.filter(
      (city) =>
        city.name.toLowerCase().includes(normalized) &&
        city.population > 100000, // Example threshold for "most populated"
    );

    return matches.length > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return `"${args.value}" no es una ciudad válida en el campo "${args.property}".`;
  }
}

export function IsCity(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCityConstraint,
    });
  };
}
