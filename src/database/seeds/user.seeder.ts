import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { UserFactory } from '../factories/user.factory';
import { demoAccess } from '../../utils/demoAccess';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const usersRepository = dataSource.getRepository(User);

    await usersRepository.insert(await (await UserFactory()).getMany(1));

    const demoUser = await usersRepository.findOneBy({
      email: demoAccess.email,
    });

    if (!demoUser) {
      await usersRepository.insert(
        await (await UserFactory()).createDemoUser(),
      );
    }

    return Promise.resolve(undefined);
  }
}
