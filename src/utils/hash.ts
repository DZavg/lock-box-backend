import { compare, hash } from 'bcrypt';
import * as sha256 from 'crypto-js/sha256';

export const hashStringByBcrypt = async (
  string: string,
  salt: number,
): Promise<string> => {
  return await hash(string, salt);
};

export const hashStringBySha256 = (string: string) => {
  return sha256(string).toString();
};

export const compareStringWithHashByBcrypt = async (
  string: string,
  hash: string,
): Promise<boolean> => {
  if (!string || !hash) return false;
  return await compare(string, hash);
};
