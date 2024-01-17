import { errorMessage } from '@/utils/errorMessage';

export const errorMessagesForFields = {
  email: (res) => {
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors.email.sort()).toEqual(
      [
        errorMessage.IsEmail,
        errorMessage.IsString,
        errorMessage.IsNotEmpty,
      ].sort(),
    );
  },
  password: (res) => {
    expect(res.body.errors).toHaveProperty('password');
    expect(res.body.errors.password.sort()).toEqual(
      [
        errorMessage.IsString,
        errorMessage.IsNotEmpty,
        errorMessage.Length(6, 30),
      ].sort(),
    );
  },
  newPassword: (res) => {
    expect(res.body.errors).toHaveProperty('newPassword');
    expect(res.body.errors.newPassword.sort()).toEqual(
      [
        errorMessage.IsString,
        errorMessage.IsNotEmpty,
        errorMessage.Length(6, 30),
      ].sort(),
    );
  },
  code: (res) => {
    expect(res.body.errors).toHaveProperty('code');
    expect(res.body.errors.code.sort()).toEqual(
      [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
    );
  },
  username: (res) => {
    expect(res.body.errors).toHaveProperty('username');
    expect(res.body.errors.username.sort()).toEqual(
      [
        errorMessage.IsString,
        errorMessage.Length(2, 30),
        errorMessage.IsNotEmpty,
      ].sort(),
    );
  },
};
