import { errorMessage } from '@/utils/errorMessage';

export const errorMessagesForFields = {
  email: [errorMessage.IsEmail, errorMessage.IsString, errorMessage.IsNotEmpty],
  password: [
    errorMessage.IsString,
    errorMessage.IsNotEmpty,
    errorMessage.Length(6, 30),
  ].sort(),
  newPassword: [
    errorMessage.IsString,
    errorMessage.IsNotEmpty,
    errorMessage.Length(6, 30),
  ].sort(),
  code: [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
  username: [
    errorMessage.Length(2, 30),
    errorMessage.IsString,
    errorMessage.IsNotEmpty,
  ].sort(),
  projectTitle: [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
  projectDomain: [errorMessage.IsString, errorMessage.IsNotEmpty].sort(),
};
