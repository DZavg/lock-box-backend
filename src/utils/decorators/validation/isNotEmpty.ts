import { ValidationOptions, IsNotEmpty as _IsNotEmpty } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export const IsNotEmpty = (opts?: ValidationOptions): PropertyDecorator =>
  _IsNotEmpty({
    message: errorMessage.IsNotEmpty,
    ...opts,
  });
