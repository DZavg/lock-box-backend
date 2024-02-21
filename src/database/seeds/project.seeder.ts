import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Project } from '../../projects/entities/project.entity';
import { ProjectFactory } from '../factories/project.factory';
import { User } from '../../users/entities/user.entity';

export class ProjectSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const projectsRepository = dataSource.getRepository(Project);
    const usersRepository = dataSource.getRepository(User);

    const users = await usersRepository.find();

    for (const user of users) {
      await projectsRepository.insert(
        await (await ProjectFactory()).getMany(user, 20),
      );
    }

    return Promise.resolve(undefined);
  }
}
