import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { UserSeeder } from './user.seeder';
import { ProjectSeeder } from './project.seeder';
import { AccessSeeder } from './access.seeder';
import { AccessTypeSeeder } from './access-type.seeder';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await new AccessTypeSeeder().run(dataSource);
    await new UserSeeder().run(dataSource);
    await new ProjectSeeder().run(dataSource);
    await new AccessSeeder().run(dataSource);

    return Promise.resolve(undefined);
  }
}
