import argon2 from "argon2";

export const hash = async (input: string) => {
  return await argon2.hash(input);
};

export const verify = async (hashed: string, input: string) => {
  return await argon2.verify(hashed, input);
};
