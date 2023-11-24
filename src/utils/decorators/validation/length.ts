import { ValidationOptions, Length as _Length } from 'class-validator';
import { errorMessage } from '@/utils/errorMessage';

export const Length = (
  min: number,
  max: number,
  opts?: ValidationOptions,
): PropertyDecorator =>
  _Length(min, max, {
    message: errorMessage.Length(min, max),
    ...opts,
  });
