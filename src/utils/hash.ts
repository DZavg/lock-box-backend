import { compare, hash } from 'bcrypt';

const salt = 11;

export const hashString = async (string: string): Promise<string> => {
  return await hash(string, salt);
};

export const compareString = async (
  string: string,
  hash: string,
): Promise<boolean> => {
  if (!string || !hash) return false;
  return await compare(string, hash);
};
