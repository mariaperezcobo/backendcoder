import UserRegisterModel from "../dao/models/userregister.model.js";
import passport from "passport";
import logger from "../logging/logger.js";
import { UserService } from "../services/index.js";
import { generateToken } from "../utils.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils.js";
import UserInsertDTO from "../DTO/users.dto.js";
import { CartService } from "../services/index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "mariapcsalem@gmail.com",
    pass: "ivpkgozjdowugjtv",
  },
});

// export const loginUser = async (req, res) => {
//   try {
//   } catch {}
//   passport.authenticate("login", { failureRedirect: "/" }, (err, user) => {
//     if (err) {
//       logger.error("Passport error:", err);
//       //console.error('Passport error:', err);
//       return res.status(500).send("An error occurred");
//     }
//     if (!user) {
//       logger.warn("User not found");
//       // console.log('User not found');
//       return res.status(400).send("invalid credentials");
//     }
//     //console.log('User authenticated successfully');
//     logger.info(`User authenticated successfully: ${user.username}`);
//     req.session.user = user;
//     return res.redirect("/productsmongoose");
//   })(req, res);
// };

//para jwt
export const register = async (req, res) => {
  const user = req.body;

  const result = await UserRegisterModel.create(user);
  const token = generateToken(result);
  res.send({ status: "success", token });
};

//para jwt
export const login = async (req, res, next) => {
  // if (user) {
  //   return res.redirect("/productsmongoose");
  // }

  console.log("Solicitud POST recibida en /api/session/login");
  const { email, password } = req.body;
  const user = await UserService.getUsers(email);

  if (!user) {
    console.error("user doesnt exist");
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  if (!isValidPassword(user, password)) {
    console.error("password not valid");
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  user.last_connection = new Date();

  const updatedUserResult = await UserService.updateUser(
    user._id,
    { last_connection: user.last_connection },
    { new: true }
  );

  if (!updatedUserResult) {
    console.error("Error updating user last_connection");
    return done("Error updating user last_connection", null);
  }

  console.log("user desde login", user);

  if (user) {
    const token = generateToken(user);

    console.log("token desde login", token);
    res.cookie("jwt", token, { httpOnly: true });
    // Envía una respuesta con el token en el cuerpo, si lo necesitas en el cliente
    res.json({ token });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};

// export const registerUser = async (req, res) => {
//   passport.authenticate(
//     "registeruser",
//     { failureRedirect: "/" },
//     (err, user) => {
//       return res.redirect("/login");
//     }
//   )(req, res);
// };

//con jwt
export const registerUser = async (req, res) => {
  const { first_name, last_name, age, rol, email, password } = req.body;
  try {
    const user = await UserService.getUsers(email);
    console.log("usuario 2", user);

    if (!email) {
      console.log("Email es nulo o indefinido");
      return res.status(400).json({ error: "el mail no es valido" });
    }

    if (user) {
      console.log("user already exist", user);
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    const rolValue = rol || "user";

    const newUser = {
      first_name,
      last_name,
      age,
      rol: rolValue,
      email,
      password: createHash(password),
    };

    //console.log('Datos del nuevo usuario:', newUser);

    // const result = await UserRegisterModel.create(newUser)

    const newUserDTO = new UserInsertDTO(newUser);

    const result = await UserService.addUsers(newUserDTO);
    console.log("usuario agregado", result);

    // Añadir el carrito al usuario
    const carrito = await CartService.addCart({ productosagregados: [] });

    result.cart = carrito.id;
    // console.log('carrito', carrito)
    console.log("carrito desde passport", carrito);
    console.log("result desp de incorporar carrito", result);

    result.last_connection = new Date();

    // Actualiza el usuario con el ID del carrito
    await UserService.updateUser(result._id, {
      cart: carrito.id,
      last_connection: result.last_connection,
    });

    //const carrito = await CartModel.create({ productosagregados: [] })

    //   console.log('Datos del nuevo usuario con carrito:', newUser);
    // Generar el token JWT

    console.log("result de passport config", result);

    return res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
  }
};

export const logOutSession = (req, res) => {
  // Obtener información del usuario de la solicitud
  const user = req.user; // Suponiendo que req.user contiene la información del usuario
  console.log("users", user);

  // Elimina el token almacenado en el cliente
  res.clearCookie("jwt"); // Esto es un ejemplo para eliminar una cookie, puedes ajustarlo según cómo manejes los tokens en tu aplicación

  // Devuelve una respuesta de éxito o redirige al cliente
  res.redirect("/");
};

export const updateUserPassword = async (req = request, res = response) => {
  try {
    const { email, password, token } = req.body;
    console.log("user para password", req.body);

    // if (!req.session.passwordReset) {
    //   return res.redirect("/mail");
    // }

    // Verificar si el token JWT es válido
    jwt.verify(token, "secret", async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ error: "Token inválido" });
      }
      // Extrae la información del token
      const { email: tokenEmail, exp } = decodedToken;

      console.log(
        "decoded token",
        decodedToken,
        "email",
        email,
        "tokenemail",
        tokenEmail,
        "expiration",
        exp
      );
      console.log("fecha de ahora", Date.now());

      const result = exp - Date.now();
      console.log("result", result);
      // Verifica si el token es para el usuario correcto y no ha expirado
      if (email === tokenEmail && exp * 1000 > Date.now()) {
        const user = await UserService.getUsersByEmail(email);
        console.log("user para password de la bd", user);

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

        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          const updatedUserResult = await UserService.updateUser(
            user._id,
            user,
            { new: true }
          );

          if (updatedUserResult) {
            req.user = updatedUserResult;
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
        return res.status(400).json({ error: "Token inválido o expirado" });
      }
    });

    // // Verificar si el token proporcionado coincide con el token almacenado en la sesión del usuario
    // if (
    //   req.session.passwordReset &&
    //   req.session.passwordReset.token === token
    // ) {
    //   // Verificar si el tiempo de expiración no ha pasado
    //   if (req.session.passwordReset.expiration > Date.now()) {
    //     // Procesar el restablecimiento de contraseña
    //     const user = await UserService.getUsersByEmail(email);
    //     console.log("user para password", user);
    //     if (!user) {
    //       return res.status(404).json({ error: "Usuario no encontrado" });
    //     }

    //     // Verificar si la nueva contraseña es igual a la contraseña actual del usuario
    //     const isSamePassword = await bcrypt.compare(password, user.password);

    //     console.log("isSame ", isSamePassword);

    //     if (isSamePassword) {
    //       return res.status(400).json({
    //         error: "La nueva contraseña debe ser diferente de la anterior",
    //       });
    //     }

    //     // Actualizar la contraseña del usuario
    //     try {
    //       const hashedPassword = await bcrypt.hash(password, 10);
    //       user.password = hashedPassword;
    //       const updatedUserResult = await UserService.updateUser(
    //         user._id,
    //         user,
    //         { new: true }
    //       );

    //       if (updatedUserResult) {
    //         delete req.session.passwordReset; // Limpiar la información de restablecimiento de contraseña de la sesión del usuario
    //         req.session.user = updatedUserResult;
    //         return res.redirect("/productsmongoose");
    //       } else {
    //         return res.status(404).json({
    //           error: "Usuario no encontrado o no se realizaron modificaciones",
    //         });
    //       }
    //     } catch (error) {
    //       console.log("Error al hashear la clave");
    //       return res.status(500).json({ error: "Error interno del servidor" });
    //     }
    //   } else {
    //     return res.redirect("/mail");
    //   }
    // } else {
    //   return res.status(400).send("El token proporcionado no es válido");
    // }
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
    }

    res.redirect("/allusers");
  } catch (error) {
    console.error("¡Error!", error);
    res.status(500).send("Error al eliminar usuarios");
  }
};
