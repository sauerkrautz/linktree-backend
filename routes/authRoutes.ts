import { Router } from "express";
import { logoutMiddleware, verifyUser } from "../middleware/verify";
import {
  check,
  checkLogStatus,
  login,
  logout,
  refreshToken,
} from "../auth/auth";

const router = Router();

router.post("/login", login);
router.post("/log", verifyUser, checkLogStatus);
router.post("/refresh", refreshToken);
router.delete("/logout", logoutMiddleware, logout);
router.get("/check", verifyUser, check);

export default router;
