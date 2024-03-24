import { Router } from "express";
import ProductManager from "../dao/managers/productManager.js";
import passport from "passport";
import {
  profileUser,
  initUser,
  loginView,
  registerView,
  homeView,
  realtimeproductsView,
  updateUserView,
  updateUser,
} from "../controllers/views.js";
import {
  updateUserPassword,
  updateUserPasswordView,
  seeUsers,
  deleteUsers,
} from "../controllers/sessions.js";
import { auth } from "../middlewares/session.middlewares.js";

const router = Router();

//para ver productos con filesystem
//router.get("/home", auth, homeView);
router.get("/home", homeView);
router.get("/realtimeproducts", realtimeproductsView);

//renders para sesiones

router.get("/", auth, initUser);
//router.get("/", initUser);

//router.get("/login", justPublicWhitoutSession, loginView);
router.get("/login", loginView);

//router.get("/registeruser", justPublicWhitoutSession, registerView);
router.get("/registeruser", registerView);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profileUser
);
router.get(
  "/updateuser",
  passport.authenticate("jwt", { session: false }),
  updateUserView
);
router.put(
  "/updateuser/:id",
  passport.authenticate("jwt", { session: false }),
  updateUser
);

router.get(
  "/updateuserpassword",

  updateUserPasswordView
);
router.post(
  "/updateuserpassword",

  updateUserPassword
);

router.get("/allusers", seeUsers);
router.post(
  "/deleteusers",

  deleteUsers
);

router.get("/error", (req, res) => res.send("pagina de error"));

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
    req.session.user = req.user;
    console.log("user session setted");
    res.redirect("/productsmongoose");
  }
);

const messages = [];
router.get("/chat", (req, res) => {
  res.render("chat", {
    style: "index.css",
    messages,
  });
});

export default router;
