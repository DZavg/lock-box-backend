import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { errorMessage } from '@/utils/errorMessage';
import baseConfigTestingModule from './baseConfigTestingModule';
import { User } from '@/users/entities/user.entity';
import { errorMessagesForFields } from './errorMessagesForFields';
import { SeedJest } from './seed-jest';
import { Project } from '@/projects/entities/project.entity';
import { UpdateProjectDto } from '@/projects/dto/update-project.dto';

describe('Projects', () => {
  let app: INestApplication;
  let userRepository;
  let projectsRepository;
  let config;
  let seedJest;
  const url = '/projects/';

  beforeAll(async () => {
    config = await baseConfigTestingModule();
    app = config.app;
    seedJest = await SeedJest(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    userRepository = config.dataSource.getRepository(User);
    await userRepository.remove(await userRepository.find());

    projectsRepository = config.dataSource.getRepository(Project);
    await projectsRepository.remove(await projectsRepository.find());
  });

  describe('/GET all projects', () => {
    it(`success get all projects`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();
      await seedJest.seedUser();

      const countProjects = (await projectsRepository.find()).length;
      const countProjectByAdminUser = (
        await projectsRepository.find({
          where: { user: { id: adminUser.id } },
        })
      ).length;

      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.length).not.toEqual(countProjects);
          expect(res.body.length).toEqual(countProjectByAdminUser);
        });
    });

    it(`failed get all projects (unauthorized)`, async () => {
      return request(app.getHttpServer())
        .get(url)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.Unauthorized,
          });
        });
    });
  });

  describe('/POST create project', () => {
    it(`Success create project`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({
          title: 'test title',
          domain: 'https://google.com/',
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toEqual({
            title: 'test title',
            domain: 'https://google.com/',
            id: expect.any(String),
          });
        });
    });

    it(`Failed create project without data`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            ['errors', 'statusCode'].sort(),
          );
          expect(Object.keys(res.body.errors).sort()).toEqual(
            ['title', 'domain'].sort(),
          );
          expect(res.body.errors.title.sort()).toEqual(
            errorMessagesForFields.projectTitle,
          );
          expect(res.body.errors.domain.sort()).toEqual(
            errorMessagesForFields.projectDomain,
          );
        });
    });
  });

  describe('/GET project user by id', () => {
    it(`Success project user`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();

      const countProjectByAdminUser = await projectsRepository.find({
        where: { user: { id: adminUser.id } },
      });

      return request(app.getHttpServer())
        .get(`${url}${countProjectByAdminUser[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            title: expect.any(String),
            domain: expect.any(String),
          });
        });
    });
    it(`Failed find project (project not found)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();

      const projectId = '9999';
      return request(app.getHttpServer())
        .get(`${url}${projectId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.ProjectNotFound,
          });
        });
    });

    it(`Failed find project (project another user)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const { user } = await seedJest.seedUser();

      const projectsByUser = await projectsRepository.find({
        where: { user: { id: user.id } },
      });

      return request(app.getHttpServer())
        .get(`${url}${projectsByUser[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.ProjectNotFound,
          });
        });
    });
  });
  //
  describe('/PATCH update project by id', () => {
    it(`Success update project`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();

      const projects = await projectsRepository.find({
        where: { user: { id: adminUser.id } },
      });

      const updateProject: UpdateProjectDto = {
        title: 'update-title',
        domain: 'update-domain',
      };
      return request(app.getHttpServer())
        .patch(`${url}${projects[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send(updateProject)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            title: updateProject.title,
            domain: updateProject.domain,
            id: projects[0].id,
          });
        });
    });
    it(`Failed update project (project not found)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const projectId = '9999';

      return request(app.getHttpServer())
        .patch(`${url}${projectId}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.ProjectNotFound,
          });
        });
    });

    it(`Failed update project (project another user)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const { user } = await seedJest.seedUser();

      const projectsByUser = await projectsRepository.find({
        where: { user: { id: user.id } },
      });

      return request(app.getHttpServer())
        .patch(`${url}${projectsByUser[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.ProjectNotFound,
          });
        });
    });
  });

  describe('/DELETE delete project by id', () => {
    it(`Success delete project`, async () => {
      const { accessToken, adminUser } = await seedJest.seedAdminUser();

      const projectsByAdminUser = await projectsRepository.find({
        where: { user: { id: adminUser.id } },
      });

      return request(app.getHttpServer())
        .delete(`${url}${projectsByAdminUser[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            message: 'success',
          });
        });
    });

    it(`Failed delete project (project another user)`, async () => {
      const { accessToken } = await seedJest.seedAdminUser();
      const { user } = await seedJest.seedUser();

      const projectsByUser = await projectsRepository.find({
        where: { user: { id: user.id } },
      });

      return request(app.getHttpServer())
        .delete(`${url}${projectsByUser[0].id}`)
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toEqual({
            error: errorMessage.ProjectNotFound,
          });
        });
    });
  });
});
