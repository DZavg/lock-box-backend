import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { UserFactory } from '../factories/user.factory';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const usersRepository = dataSource.getRepository(User);

    await usersRepository.insert(await (await UserFactory()).getMany(20));

    return Promise.resolve(undefined);
  }
}
