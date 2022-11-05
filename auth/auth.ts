import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(404).json({ msg: "user not found" });

  const verified = await argon2.verify(user.password, password);

  if (email === user.email && verified) {
    req.session.user = user.uuid;
    console.log(req.session.user);
    res.status(200).json({ msg: "logged in" });
  } else if (user.email !== email && verified === false) {
    res.status(400).json({ msg: "email and password do not match" });
  } else if (email !== user.email) {
    res.status(400).json({ msg: "email does not match" });
  } else if (verified === false) {
    res.status(400).json({ msg: "password does not match" });
  }
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ msg: "something went wrong" });
    res.status(200).json({ msg: "logged out" });
  });
};
