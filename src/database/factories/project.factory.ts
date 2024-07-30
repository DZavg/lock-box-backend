import { faker } from '@faker-js/faker';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

export const ProjectFactory = async () => {
  const get = async (user: User) => {
    const project = new Project();
    project.title = faker.internet.domainWord();
    project.domain = faker.internet.url();
    project.user = user;

    return project;
  };

  const getMany = async (user: User, count) => {
    const projects: Project[] = [];

    for (let i = 0; i < count; i++) {
      projects.push(await get(user));
    }
    return projects;
  };

  return { get, getMany };
};
