import { faker } from '@faker-js/faker';
import { Access } from '../..//accesses/entities/access.entity';
import { Project } from '../../projects/entities/project.entity';

export const AccessFactory = async () => {
  const get = async (project: Project) => {
    const access = new Access();
    access.origin = faker.internet.domainName();
    access.login = faker.internet.userName();
    access.type = 'SSH';
    access.password = faker.internet.password();
    access.project = project;

    return access;
  };

  const getMany = async (project: Project, count) => {
    const accesses: Access[] = [];

    for (let i = 0; i < count; i++) {
      accesses.push(await get(project));
    }
    return accesses;
  };

  return { get, getMany };
};
