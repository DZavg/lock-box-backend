import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(field: any, args: ValidationArguments) {
    const entity = args.constraints[0];

    return !(await this.dataSource
      .getRepository(entity)
      .createQueryBuilder('entity')
      .select()
      .where(`entity.${args.property} = :val`, { val: field })
      .getOne());
  }
}

export function IsUnique(entity, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: IsUniqueConstraint,
    });
  };
}
