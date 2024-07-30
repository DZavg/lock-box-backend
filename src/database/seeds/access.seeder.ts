import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Access } from '../../accesses/entities/access.entity';
import { AccessFactory } from '../factories/access.factory';
import { AccessType } from '../../accesses/entities/access-type.entity';
import { faker } from '@faker-js/faker';
import { accessTypesEnum } from '../../accesses/access-types.enum';

export class AccessSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const accessTypeRepository = dataSource.getRepository(AccessType);
    const accessesRepository = dataSource.getRepository(Access);
    const projectsRepository = dataSource.getRepository(Project);
    const usersRepository = dataSource.getRepository(User);

    const users = await usersRepository.find();
    const accessTypes = await accessTypeRepository.find();

    for (const user of users) {
      const projects = await projectsRepository.find({
        where: { user: { id: user.id } },
      });
      for (const project of projects) {
        await accessesRepository.insert(
          await (
            await AccessFactory()
          ).getMany(
            project,
            accessTypes[
              faker.number.int({ min: 0, max: accessTypesEnum.length - 1 })
            ],
            20,
          ),
        );
      }
    }

    return Promise.resolve(undefined);
  }
}
