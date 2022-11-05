import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashed = await argon2.hash(password);

  try {
    await prisma.user.create({
      data: {
        email: email,
        password: hashed,
      },
    });

    res.status(200).json({ msg: "user added" });
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
  } catch (error: any) {
    res.status(500).json(error);
  }
};
