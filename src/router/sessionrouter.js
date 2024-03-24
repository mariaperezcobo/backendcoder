import { Router } from "express";
import { logOutSession, login, registerUser } from "../controllers/sessions.js";
//import { generateToken, authToken } from "../utils.js";
import passport from "passport";

const router = Router();

// router.post("/login", loginUser);
router.post("/login", login);

router.post("/registeruser", registerUser);

router.get("/logout", logOutSession);

export default router;
