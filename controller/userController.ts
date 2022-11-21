import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import argon2 from "argon2";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const { uuid, id, username, userEmail, password, social }: any = user;

  return {
    uuid,
    id,
    username,
    email: userEmail,
    password,
    social,
  };
};

export const addUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const hashed = await argon2.hash(password);

  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashed,
      },
    });

    res.status(200).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      if (error.meta.target === "user_username_key") {
        res.status(400).json({ msg: "username is already taken" });
      } else if (error.meta.target === "user_email_key") {
        res.status(400).json({ msg: "email is already taken" });
      }
    } else {
      res.status(400).json(error);
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        social: true,
        refreshToken: true,
      },
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getUserAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
      select: {
        username: true,
        email: true,
        role: true,
        social: true,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: req.uuid,
      },
      select: {
        username: true,
        email: true,
        social: true,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
      select: {
        uuid: true,
        username: true,
        email: true,
        social: true,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const updateUserAdmin = async (req: Request, res: Response) => {
  const { username, email, role } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      uuid: req.params.id,
    },
    select: {
      username: true,
      email: true,
      role: true,
    },
  });
  try {
    const updated = await prisma.user.update({
      where: {
        uuid: req.params.id,
      },
      data: {
        username: username ? username : user?.username,
        email: email ? email : user?.email,
        role: role ? role : user?.role,
      },
    });

    res.status(200).json({ old: user, updated: updated });
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, email, role } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      uuid: req.uuid,
    },
    select: {
      username: true,
      email: true,
    },
  });

  if (!user)
    return res.status(401).json({
      msg: "please login, like wtf, how did you even get here, bypassing the middleware? no way",
    });

  try {
    const updated = await prisma.user.update({
      where: {
        uuid: req.uuid,
      },
      data: {
        username: username ? username : user?.username,
        email: email ? email : user?.email,
      },
      select: {
        username: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({ old: user, updated: updated });
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.user.delete({
      where: {
        uuid: id,
      },
      select: {
        email: true,
        username: true,
      },
    });

    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json(error);
  }
};
