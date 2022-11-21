import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { hash } from "./hash";

const db = new PrismaClient();

export const generateAccessToken = (user: any) => {
  return sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });
};

export const generateRefreshToken = (user: any, jti: string) => {
  return sign({ user, jti }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "8h",
  });
};

export const addTokenToWhiteList = async (
  refreshToken: string,
  jti: string,
  userId: string
) => {
  const token = await db.refreshToken.findUnique({
    where: {
      userId: userId,
    },
  });

  try {
    if (!token) {
      await db.refreshToken.create({
        data: {
          id: jti,
          hashedToken: await hash(refreshToken),
          userId,
        },
      });
    } else {
      await db.refreshToken.update({
        where: {
          userId: userId,
        },
        data: {
          id: jti,
          hashedToken: await hash(refreshToken),
          userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateTokenInWhiteList = async (
  refreshToken: string,
  jti: string,
  userId: string
) => {
  try {
    await db.refreshToken.update({
      where: {
        userId: userId,
      },
      data: {
        id: jti,
        hashedToken: await hash(refreshToken),
        userId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const generateTokens = (user: any, jti: string) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
};
