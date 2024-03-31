import { Router } from "express";
import { chatPost, chatView } from "../controllers/chat.js";
import { isUser } from "../middlewares/session.middlewares.js";
import passport from "passport";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isUser,
  chatView
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isUser,
  chatPost
);

export default router;
