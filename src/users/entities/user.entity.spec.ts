import { User } from './user.entity';

describe('User class', () => {
  const dateNow = new Date();
  const mockUser = {
    id: 1,
    email: 'email@email.email',
    password: 'password',
    createdAt: dateNow,
    updatedAt: dateNow,
  };
  it('should make a user with mock data', () => {
    const user = new User(mockUser);
    expect(user).toBeTruthy();
    expect(user.id).toBe(mockUser.id);
    expect(user.email).toBe(mockUser.email);
    expect(user.password).toBe(mockUser.password);
    expect(user.createdAt).toBe(mockUser.createdAt);
    expect(user.updatedAt).toBe(mockUser.updatedAt);
  });

  it('should make a user without data', () => {
    const user = new User();
    expect(user).toBeTruthy();
    expect(user.id).toBeUndefined();
    expect(user.email).toBeUndefined();
    expect(user.password).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
    expect(user.updatedAt).toBeUndefined();
  });
});
