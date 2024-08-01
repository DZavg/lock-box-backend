import { faker } from '@faker-js/faker';
import { Access } from '../../accesses/entities/access.entity';
import { Project } from '../../projects/entities/project.entity';
import { AccessType } from '../../accesses/entities/access-type.entity';

export const AccessFactory = async () => {
  const get = async (project: Project, accessType: AccessType) => {
    const access = new Access();
    access.origin = faker.internet.url();
    access.login = faker.internet.userName();
    access.type = accessType;
    access.password = faker.internet.password();
    access.project = project;

    return access;
  };

  const getMany = async (project: Project, accessType: AccessType, count) => {
    const accesses: Access[] = [];

    for (let i = 0; i < count; i++) {
      accesses.push(await get(project, accessType));
    }
    return accesses;
  };

  return { get, getMany };
};
