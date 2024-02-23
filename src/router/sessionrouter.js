import { Router } from "express";
import {
  logOutSession,
  loginUser,
  registerUser,
} from "../controllers/sessions.js";

const router = Router();

router.post("/login", loginUser);

router.post("/registeruser", registerUser);

router.get("/logout", logOutSession);

export default router;
