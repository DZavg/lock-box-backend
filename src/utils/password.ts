import { compare, hash } from 'bcrypt';

const salt = 11;

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};
