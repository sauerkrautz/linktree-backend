import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user)
    return res.status(403).json({ msg: "please login to your account" });

  const user = await prisma.user.findUnique({
    where: {
      uuid: req.session.user,
    },
  });

  req.body.userid = user?.id;
  next();
};
