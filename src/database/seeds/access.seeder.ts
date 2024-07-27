import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Access } from '../../accesses/entities/access.entity';
import { AccessFactory } from '../factories/access.factory';

export class AccessSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const accessesRepository = dataSource.getRepository(Access);
    const projectsRepository = dataSource.getRepository(Project);
    const usersRepository = dataSource.getRepository(User);

    const users = await usersRepository.find();

    for (const user of users) {
      const projects = await projectsRepository.find({
        where: { user: { id: user.id } },
      });
      for (const project of projects) {
        await accessesRepository.insert(
          await (await AccessFactory()).getMany(project, 20),
        );
      }
    }

    return Promise.resolve(undefined);
  }
}
