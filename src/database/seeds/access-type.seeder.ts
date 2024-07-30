import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AccessType } from '../../accesses/entities/access-type.entity';
import { AccessTypeFactory } from '../factories/access-type.factory';
import { accessTypesEnum } from '../../accesses/access-types.enum';

export class AccessTypeSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const accessTypeRepository = dataSource.getRepository(AccessType);

    await accessTypeRepository.insert(
      await (await AccessTypeFactory()).getMany(accessTypesEnum.length),
    );

    return Promise.resolve(undefined);
  }
}
