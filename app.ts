import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";

import userRoute from "./routes/userRoutes";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  session({
    secret: "key",
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    resave: false,
    cookie: {
      secure: "auto",
      maxAge: 7 * 24 * 60 * 1000,
    },
  })
);

app.use(userRoute);

app.listen(5000, () => {
  console.log("connected to prisma sql");
});
