import { registerDecorator, ValidationOptions } from 'class-validator';
import * as isLength from 'validator/lib/isLength';

export const PASSWORD_REQUIREMENTS =
  'Your password must be at least 8 characters, contain at least one uppercase' +
  ' letter, one lowercase letter, one number and one non-alphanumeric character.';

export const IsPassword = (validationOptions?: ValidationOptions) => {
  // tslint:disable-next-line
  return (object: Object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: (val: string) =>
          !!(
            typeof val === 'string' &&
            isLength(val, { min: 8 }) &&
            val.match(/[A-Z]/) &&
            val.match(/[a-z]/) &&
            val.match(/[0-9]/) &&
            val.match(/[^a-zA-Z0-9]/)
          ),
        defaultMessage: () => PASSWORD_REQUIREMENTS,
      },
    });
  };
};
