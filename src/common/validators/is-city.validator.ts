//Objective: Create a custom validation decorator to check if a given string is a valid city name from a predefined list of cities, ensuring that the city has a significant population.
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
        city.population > 100000, // Guarantee significant population
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
