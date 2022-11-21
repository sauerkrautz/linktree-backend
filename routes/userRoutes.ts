import { Router } from "express";
import { addSocialMedia } from "../controller/socialMediaController";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserAdmin,
} from "../controller/userController";
import { adminOnly, verifyUser } from "../middleware/verify";

const router = Router();

router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/user", verifyUser, getUser);
router.post("/user", addUser);
router.patch("/user", verifyUser, updateUser);
router.patch("/update/:id", verifyUser, adminOnly, updateUserAdmin);
router.delete("/user/:id", verifyUser, adminOnly, deleteUser);

export default router;
