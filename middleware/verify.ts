import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  if (authHeaders === null) res.status(403).json({ verified: false });
  const token = authHeaders && authHeaders.split(" ")[1];

  verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    {},
    async (error, decoded: any) => {
      if (error) return res.status(403).json({ verified: false });

      req.uuid = decoded.user.uuid;
      req.id = decoded.user.id;

      const user = await prisma.refreshToken.findUnique({
        where: {
          userId: `${decoded.user.uuid}`,
        },
        select: {
          revoked: true,
        },
      });

      if (!user)
        return res.status(404).json({ msg: "user not found", verified: false });

      if (user?.revoked === true)
        return res.status(403).json({ verified: false });

      console.log("cookie down here");
      console.info(req.cookies);
      console.log("decoded value down here");
      console.info(decoded.user);

      next();
    }
  );
};

export const logoutMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaders = req.headers["authorization"];
  if (authHeaders === null) res.status(403).json({ verified: false });
  const token = authHeaders && authHeaders.split(" ")[1];

  verify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    {},
    async (error, decoded: any) => {
      if (error) return res.sendStatus(500);

      req.uuid = decoded.user.uuid;
    }
  );

  next();
};

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await prisma.user.findUnique({
    where: {
      uuid: req.uuid,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== "admin") return res.status(403).json({ verified: false });
  next();
};
