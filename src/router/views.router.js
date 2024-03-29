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

const router = Router();

//middlewares para sesiones
function justPublicWhitoutSession(req, res, next) {
  if (req.session?.user) return res.redirect("/profile");
  return next();
}

function auth(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect("/login");
}

const productManager = new ProductManager();

//para ver productos con filesystem
router.get("/home", auth, homeView);
router.get("/realtimeproducts", realtimeproductsView);

//renders para sesiones

router.get("/", auth, initUser);

router.get("/login", justPublicWhitoutSession, loginView);

router.get("/registeruser", justPublicWhitoutSession, registerView);

router.get("/profile", auth, profileUser);
router.get("/updateuser", auth, updateUserView);
router.put("/updateuser/:id", auth, updateUser);

router.get("/updateuserpassword", updateUserPasswordView);
router.post("/updateuserpassword", updateUserPassword);

router.get("/allusers", seeUsers);
router.post("/deleteusers", deleteUsers);

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
