import UserRegisterModel from "../dao/models/userregister.model.js";
import passport from "passport";
import logger from "../logging/logger.js";
import { createHash } from "../utils.js";
import { UserService } from "../services/index.js";
import { generateToken } from "../utils.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "mariapcsalem@gmail.com",
    pass: "ivpkgozjdowugjtv",
  },
});

export const loginUser = async (req, res) => {
  try {
  } catch {}
  passport.authenticate("login", { failureRedirect: "/" }, (err, user) => {
    if (err) {
      logger.error("Passport error:", err);
      //console.error('Passport error:', err);
      return res.status(500).send("An error occurred");
    }
    if (!user) {
      logger.warn("User not found");
      // console.log('User not found');
      return res.status(400).send("invalid credentials");
    }
    //console.log('User authenticated successfully');
    logger.info(`User authenticated successfully: ${user.username}`);
    req.session.user = user;
    return res.redirect("/productsmongoose");
  })(req, res);
};

export const registerUser = async (req, res) => {
  passport.authenticate(
    "registeruser",
    { failureRedirect: "/" },
    (err, user) => {
      return res.redirect("/login");
    }
  )(req, res);
};
export const logOutSession = (req, res) => {
  req.logout(function (err) {
    if (err) {
      logger.error("logout error:", err);
      return res.send("logout error");
    }
    req.session.destroy(function (err) {
      if (err) {
        logger.error("logout error:", err);
        return res.send("logout error");
      }
      return res.redirect("/");
    });
  });
};

// // Middleware para verificar el rol del usuario
// export function isAdmin(req, res, next) {
//   // Verificar si el usuario está autenticado y tiene el rol de admin
//   if (
//     req.session?.user &&
//     (req.session.user.rol === "admin" || req.session.user.rol === "premium")
//   ) {
//     return next();
//   }

//   // Si el usuario no es admin, redirigir a otra página o enviar un error
//   res.status(403).send(`
//     <script>
//         alert('Acceso denegado: solo los administradores o los premium pueden realizar esta acción');
//         window.location.href = '/productsmongoose';
//       </script>
//     `);
// }

// export function isAdminEliminate(req, res, next) {
//   // Verificar si el usuario está autenticado y tiene el rol de admin
//   if (
//     req.session?.user &&
//     (req.session.user.rol === "admin" || req.session.user.rol === "premium")
//   ) {
//     return next();
//   }

//   // Si el usuario no es admin, redirigir a otra página o enviar un error
//   res.status(403).json({
//     error:
//       "Acceso denegado: solo los administradores pueden realizar esta acción",
//   });
// }

// export function isUser(req, res, next) {
//   logger.info(`Estado de la sesión en isUser middleware: ${req.session}`);
//   console.log("Estado de la sesión en isUser middleware:", req.session);
//   // Verificar si el usuario está autenticado y tiene el rol de admin
//   if (req.session?.user && req.session.user.rol !== "admin") {
//     return next();
//   } else {
//     // Si el usuario no es admin, redirigir a otra página o enviar un error
//     res.status(403).send(`
//   <script>
//       alert('Acceso denegado: solo los usuarios pueden realizar esta acción');
//       window.location.href = '/productsmongoose';
//     </script>
//   `);
//   }
// }

export const updateUserPassword = async (req = request, res = response) => {
  try {
    const { email, password, token } = req.body;
    console.log("user para password", req.body);

    if (!req.session.passwordReset) {
      return res.redirect("/mail");
    }

    // Verificar si el token proporcionado coincide con el token almacenado en la sesión del usuario
    if (
      req.session.passwordReset &&
      req.session.passwordReset.token === token
    ) {
      // Verificar si el tiempo de expiración no ha pasado
      if (req.session.passwordReset.expiration > Date.now()) {
        // Procesar el restablecimiento de contraseña
        const user = await UserService.getUsersByEmail(email);
        console.log("user para password", user);
        if (!user) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar si la nueva contraseña es igual a la contraseña actual del usuario
        const isSamePassword = await bcrypt.compare(password, user.password);

        console.log("isSame ", isSamePassword);

        if (isSamePassword) {
          return res.status(400).json({
            error: "La nueva contraseña debe ser diferente de la anterior",
          });
        }

        // Actualizar la contraseña del usuario
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          const updatedUserResult = await UserService.updateUser(
            user._id,
            user,
            { new: true }
          );

          if (updatedUserResult) {
            delete req.session.passwordReset; // Limpiar la información de restablecimiento de contraseña de la sesión del usuario
            req.session.user = updatedUserResult;
            return res.redirect("/productsmongoose");
          } else {
            return res.status(404).json({
              error: "Usuario no encontrado o no se realizaron modificaciones",
            });
          }
        } catch (error) {
          console.log("Error al hashear la clave");
          return res.status(500).json({ error: "Error interno del servidor" });
        }
      } else {
        return res.redirect("/mail");
      }
    } else {
      return res.status(400).send("El token proporcionado no es válido");
    }
  } catch (error) {
    console.log("Error al hashear la clave");
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUserPasswordView = async (req = request, res = response) => {
  try {
    const { email, token } = req.query;

    res.render("resetpassword", {
      email,
      token,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`User error: ${error.message}`);
    // console.error('error', error)
  }
};

export const seeUsers = async (req = request, res = response) => {
  try {
    const users = await UserService.getAllUsers();

    res.render("allusers", {
      users,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    // Renderiza una página de error o maneja el error de alguna otra manera
    res.status(500).send("Error fetching users");
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();

    const currentTime = new Date();
    console.log("current time", currentTime);

    for (const user of users) {
      console.log("user 1", user);
      console.log("user lastConnection1", user.last_connection);
      const lastConnectionTime = new Date(user.last_connection);

      if (
        lastConnectionTime instanceof Date &&
        !isNaN(lastConnectionTime.getTime())
      ) {
        console.log("lastConnection es una fecha válida:", lastConnectionTime);
      } else {
        console.log(
          "lastConnection no es una fecha válida:",
          user.lastConnection
        );
      }

      const timeDifference = (currentTime - lastConnectionTime) / (1000 * 60);
      console.log("time diference", timeDifference);

      console.log("user", user);
      if (timeDifference > 10) {
        await UserService.deleteUser(user._id);
        console.log(
          `Usuario ${user.id} eliminado debido a una conexión menor a 30 minutos.`
        );
      }

      const mailInfo = {
        from: "mariaperezcobo@gmail.com",
        to: user.email, // El correo electrónico del usuario obtenido del req.session.user.email
        subject: "Cuenta eliminada por falta de actividad",
        html: `
        <div>
            <h2> Se ha eliminado la cuenta por falta de actividad </h2>
            <h4> Podes volver a crearte una nueva cuenta! Te esperamos!</h4><br>
        </div>
    `,
      };

      transporter.sendMail(mailInfo, function (error, info) {
        if (error) {
          logger.error(
            `Error al enviar el correo electrónico: ${error.message}`
          );
        } else {
          logger.info(`Correo electrónico enviado: ${info.response}`);
        }
      });
    }

    res.redirect("/allusers");
  } catch (error) {
    console.error("¡Error!", error);
    res.status(500).send("Error al eliminar usuarios");
  }
};
