import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isNotEmpty,
} from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

@ValidatorConstraint({ async: false })
class IsNotEmptyConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isNotEmpty(value);
  }
}

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: errorMessage.IsNotEmpty, ...validationOptions },
      validator: IsNotEmptyConstraint,
    });
  };
}
