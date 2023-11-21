import { compare, hash } from 'bcrypt';

export const hashStringByBcrypt = async (
  string: string,
  salt: number,
): Promise<string> => {
  return await hash(string, salt);
};

export const compareStringWithHashByBcrypt = async (
  string: string,
  hash: string,
): Promise<boolean> => {
  if (!string || !hash) return false;
  return await compare(string, hash);
};
