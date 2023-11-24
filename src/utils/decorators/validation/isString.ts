import { ValidationOptions, IsString as _IsString } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export const IsString = (opts?: ValidationOptions): PropertyDecorator =>
  _IsString({
    message: errorMessage.IsString,
    ...opts,
  });
