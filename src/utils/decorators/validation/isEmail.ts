import { ValidationOptions, IsEmail as _IsEmail } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';
import ValidatorJS from 'validator';

export const IsEmail = (
  options?: ValidatorJS.IsEmailOptions,
  opts?: ValidationOptions,
): PropertyDecorator =>
  _IsEmail(options, {
    message: errorMessage.IsEmail,
    ...opts,
  });
