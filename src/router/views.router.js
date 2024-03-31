import { Router } from "express";
import passport from "passport";
import {
  profileUser,
  initUser,
  loginView,
  registerView,
  homeView,
  updateUserView,
  updateUser,
  mail,
  mailView,
} from "../controllers/views.js";
import {
  updateUserPassword,
  updateUserPasswordView,
  seeUsers,
  deleteUsers,
} from "../controllers/sessions.js";
import {
  auth,
  requireAuth,
  justPublicWhitoutSession,
} from "../middlewares/session.middlewares.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils.js";

const router = Router();

router.get("/home", homeView);

//renders para sesiones

router.get("/", requireAuth, initUser);
//router.get("/", initUser);

router.get("/login", justPublicWhitoutSession, loginView);

router.get("/registeruser", registerView);

router.get("/profile", requireAuth, profileUser);

router.get("/updateuser", requireAuth, updateUserView);
router.put("/updateuser/:id", requireAuth, updateUser);

router.get("/updateuserpassword", updateUserPasswordView);

router.post("/updateuserpassword", updateUserPassword);

router.get("/allusers", seeUsers);

router.post("/deleteusers", deleteUsers);

router.get("/error", (req, res) => res.send("pagina de error"));

router.get("/mail", mailView);

router.post("/mail", mail);

//sesion login con github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

//sesion login con github
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/error" }),
  (req, res) => {
    console.log("Callback:", req.user);
    const user = req.user;
    const token = generateToken(user);

    console.log("token desde login", token);
    res.cookie("jwt", token, { httpOnly: true });

    res.redirect("/productsmongoose");
  }
);

router.post(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

const messages = [];
router.get("/chat", (req, res) => {
  res.render("chat", {
    style: "index.css",
    messages,
  });
});

export default router;
