import argon2 from "argon2";
import { verify, sign } from "jsonwebtoken";
import { v4 } from "uuid";
import {
  generateTokens,
  addTokenToWhiteList,
  generateRefreshToken,
} from "../utils/token";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { decode } from "punycode";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      refreshToken: {
        select: {
          revoked: true,
        },
      },
    },
  });

  if (!user)
    return res.status(404).json({ msg: "user not found", verified: false });

  await prisma.refreshToken.update({
    where: {
      userId: user?.uuid,
    },
    data: {
      revoked: false,
    },
  });

  console.log(user);
  const verified = await argon2.verify(user.password, password);

  if (email === user.email && verified) {
    const rand = v4();
    const { accessToken, refreshToken } = generateTokens(user, rand);

    await addTokenToWhiteList(refreshToken, rand, user.uuid);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 7 * 24,
    });

    res.status(200).json({ accessToken, refreshToken });
  } else if (user.email !== email || verified === false) {
    res
      .status(400)
      .json({ msg: "email and password do not match", verified: false });
  }
};

export const check = async (req: Request, res: Response) => {
  if (!req.uuid)
    return res.status(401).json({ msg: "please login to your account" });

  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: req.uuid,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const checkLogStatus = async (req: Request, res: Response) => {
  try {
    const authHeaders = req.headers["authorization"];
    if (authHeaders === null) res.status(403).json({ verified: false });
    const token = authHeaders && authHeaders.split(" ")[1];

    verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {},
      (error, decoded: any) => {
        if (error) return res.status(401);
        res.status(200).json({ verified: true });
      }
    );
  } catch (error) {
    res.status(400).json({ verified: false });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeaders = req.headers["authorization"];
    if (authHeaders === null) res.status(403).json({ verified: false });
    const token = authHeaders && authHeaders.split(" ")[1];

    verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      {},
      (error, decoded: any) => {
        if (error) {
          console.log(error);
          return res.status(403).json({ verified: false });
        }
        console.log(decoded);

        const newAccessToken = sign(
          { user: decoded.user },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "20s" }
        );
        return res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    return res.status(500).json({ verified: false });
  }
};

export const logout = async (req: Request, res: Response) => {
  await prisma.refreshToken.update({
    where: {
      userId: req.uuid,
    },
    data: {
      revoked: true,
    },
  });

  res
    .clearCookie("refreshToken")
    .status(200)
    .json({ msg: "logged out successfuly" });
};
