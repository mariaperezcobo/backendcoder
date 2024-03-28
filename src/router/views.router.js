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
} from "../controllers/views.js";
import {
  updateUserPassword,
  updateUserPasswordView,
  seeUsers,
  deleteUsers,
} from "../controllers/sessions.js";
import {
  auth,
  justPublicWhitoutSession,
} from "../middlewares/session.middlewares.js";
import jwt from "jsonwebtoken";
import { transport } from "../utils.js";

const router = Router();

router.get("/home", homeView);

//renders para sesiones

router.get("/", auth, initUser);
//router.get("/", initUser);

router.get("/login", justPublicWhitoutSession, loginView);

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

router.get("/updateuserpassword", updateUserPasswordView);

router.post("/updateuserpassword", updateUserPassword);

router.get("/allusers", seeUsers);

router.post("/deleteusers", deleteUsers);

router.get("/error", (req, res) => res.send("pagina de error"));

router.get("/mail", (req, res) => {
  res.render("password", {
    style: "index.css",
    messages,
  });
});

router.post("/mail", async (req, res) => {
  const email = req.body.email;

  const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });

  // const expiration = Date.now() + 120000; //3600000;
  // req.session.passwordReset = { token, expiration, email };

  const resetLink = `http://localhost:8080/updateuserpassword?token=${token}`; // Construir el enlace con el token

  const result = await transport.sendMail({
    from: "mariapcsalem@gmail.com.ar",
    to: email,
    subject: "Recuperacion de contraseña",
    html: `
          <div>
              <h2> 'Haz clic en el siguiente enlace para restablecer tu contraseña: </h2>
              <a href="${resetLink}">${resetLink}</a> 
              
          </div>
      `,
  });

  console.log(result);
  res.send(`Email sent! 😎`);
});

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
