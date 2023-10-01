import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { hashString } from '../../utils/hash';

export const UserFactory = async () => {
  const hashPass = await hashString('123456');

  const get = async () => {
    const user = new User();
    user.email = faker.internet.email();
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
