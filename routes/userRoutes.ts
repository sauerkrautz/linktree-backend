import { Router } from "express";
import { login, logout } from "../auth/auth";
import { addUser, getUsers } from "../controller/userController";
import { verify } from "../middleware/verify";

const router = Router();

router.post("/users", verify, addUser);
router.get("/users", verify, getUsers);
router.post("/login", login);
router.delete("/logout", verify, logout);

export default router;
