import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../utils/password';

export const UserFactory = async () => {
  const hashPass = await hashPassword('123456');

  const get = async () => {
    const user = new User();
    user.email = faker.internet.email() + Math.floor(Math.random() * 10000);
    user.password = hashPass;

    return user;
  };

  const getMany = async (count) => {
    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      users.push(await get());
    }
    return users;
  };

  return { get, getMany };
};
