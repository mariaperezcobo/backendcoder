import UserRegisterModel from "../dao/models/userregister.model.js";
import passport from "passport";
import logger from "../logging/logger.js";
import { createHash } from "../utils.js";
import { UserService } from "../services/index.js";
import { generateToken } from "../utils.js";

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

// Middleware para verificar el rol del usuario
export function isAdmin(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (
    req.session?.user &&
    (req.session.user.rol === "admin" || req.session.user.rol === "premium")
  ) {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).send(`
    <script>
        alert('Acceso denegado: solo los administradores o los premium pueden realizar esta acción');
        window.location.href = '/productsmongoose';  
      </script>
    `);
}

export function isAdminEliminate(req, res, next) {
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (
    req.session?.user &&
    (req.session.user.rol === "admin" || req.session.user.rol === "premium")
  ) {
    return next();
  }

  // Si el usuario no es admin, redirigir a otra página o enviar un error
  res.status(403).json({
    error:
      "Acceso denegado: solo los administradores pueden realizar esta acción",
  });
}

export function isUser(req, res, next) {
  logger.info(`Estado de la sesión en isUser middleware: ${req.session}`);
  console.log("Estado de la sesión en isUser middleware:", req.session);
  // Verificar si el usuario está autenticado y tiene el rol de admin
  if (req.session?.user && req.session.user.rol !== "admin") {
    return next();
  } else {
    // Si el usuario no es admin, redirigir a otra página o enviar un error
    res.status(403).send(`
  <script>
      alert('Acceso denegado: solo los usuarios pueden realizar esta acción');
      window.location.href = '/productsmongoose';  
    </script>
  `);
  }
}

export const updateUserPassword = async (req = request, res = response) => {
  try {
    const { email, password, token } = req.body;
    console.log("Datos recibidos en el cuerpo de la solicitud:", req.body);
    console.log("req.sessios", req.session.passwordReset);
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

        // Actualizar la contraseña del usuario
        try {
          user.password = createHash(password);
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
        return res
          .status(400)
          .send("El enlace de restablecimiento de contraseña ha caducado");
      }
    } else {
      return res.status(400).send("El token proporcionado no es válido");
    }
  } catch (error) {
    logger.error(`Error al actualizar la contraseña: ${error.message}`);
    return res.status(500).json({ error: "Error interno del servidor" });
  }

  //   const user = await UserService.getUsersByEmail(email)
  //   if (!user) {
  //     return res.status(404).json({ error: 'Usuario no encontrado' });
  // }

  // Actualizar la contraseña del usuario
  //   try {
  //     user.password = createHash(password);
  // } catch (error) {
  //     console.log('Error al hashear la clave');
  //     return res.status(500).json({ error: 'Error interno del servidor' });
  // }

  //       const updatedUserResult = await UserService.updateUser(user._id, user, { new: true });

  //       console.log('updatedUserResult desde updateUserpassword', updatedUserResult)

  //       if (updatedUserResult) {
  //         req.session.user = updatedUserResult;
  //           res.status(200).json({ message: 'password actualizado correctamente' });
  //       } else {
  //           logger.warn(`Error al actualizar el user: ${error.message}`);
  //           res.status(404).json({ error: 'user no encontrado o no se realizaron modificaciones' });
  //       }

  //     ;
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
