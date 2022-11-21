import { Router } from "express";
import {
  addSocialMedia,
  getSocialMedias,
  updateSocialMedia,
} from "../controller/socialMediaController";
import { verifyUser } from "../middleware/verify";

const router = Router();

router.get("/socials", verifyUser, getSocialMedias);
router.post("/socials", verifyUser, addSocialMedia);
router.patch("/socials", verifyUser, updateSocialMedia);

export default router;
