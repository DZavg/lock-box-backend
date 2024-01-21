import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { hashStringByBcrypt } from '../../utils/hash';
import { SALT_FOR_PASSWORD } from '../../roles/constants';

export const UserFactory = async () => {
  const hashPass = await hashStringByBcrypt('123456', SALT_FOR_PASSWORD);

  const get = async () => {
    const user = new User();
    user.email = faker.internet.email();
    user.username = faker.internet.userName();
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
