import { compare, hash } from 'bcrypt';

const salt = 11;

export const hashString = async (string: string): Promise<string> => {
  return await hash(string, salt);
};

export const compareString = async (
  string: string,
  hash: string,
): Promise<boolean> => {
  return await compare(string, hash);
};
