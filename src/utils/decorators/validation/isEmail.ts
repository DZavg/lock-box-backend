import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isEmail,
} from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import ValidatorJS from 'validator';

@ValidatorConstraint({ async: false })
class IsEmailConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isEmail(value);
  }
}

export function IsEmail(
  options?: ValidatorJS.IsEmailOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: errorMessage.IsEmail, ...validationOptions },
      validator: IsEmailConstraint,
    });
  };
}
