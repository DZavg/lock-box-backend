import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserSeeder } from './user.seeder';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await new UserSeeder().run(dataSource);

    return Promise.resolve(undefined);
  }
}
