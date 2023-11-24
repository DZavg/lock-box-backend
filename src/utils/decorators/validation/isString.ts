import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isString,
} from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

@ValidatorConstraint({ async: false })
class IsStringConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isString(value);
  }
}

export function IsString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: errorMessage.IsString, ...validationOptions },
      validator: IsStringConstraint,
    });
  };
}
