import { request, response } from "express";
import ProductManager from "../dao/managers/productManager.js";
import logger from "../logging/logger.js";
import jwt from "jsonwebtoken";
import { transport } from "../utils.js";
import { UserService } from "../services/index.js";
import environmentConfig from "../enviroments.js";

export const profileUser = async (req = request, res = response) => {
  try {
    const user = req.user;

    res.render("profile", {
      user,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`User error: ${error.message}`);
    // console.error('error', error)
  }
};

export const initUser = async (req = request, res = response) => {
  try {
    const user = req.user;

    return res.render("index", {
      //   user,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`EUser error from initUser: ${error.message}`);
  }
};
export const loginView = async (req = request, res = response) => {
  try {
    return res.render("login", {
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error t: ${error.message}`);
    //console.error('error', error)
  }
};

export const registerView = async (req = request, res = response) => {
  try {
    return res.render("registeruser", {
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    console.error("error", error);
  }
};

export const homeView = async (req = request, res = response) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();

    res.render("home", {
      products,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    console.error("error", error);
  }
};

// export const realtimeproductsView = async (req = request, res = response) => {
//   try {
//     const productManager = new ProductManager();
//     const products = await productManager.getProducts();
//     res.render("realtimeproducts", {
//       products,
//       style: "index.css",
//       title: "Fitness Ropa deportiva",
//     });
//   } catch (error) {
//     console.error("error", error);
//   }
// };

export const updateUser = async (req = request, res = response) => {
  try {
    console.log('Solicitud recibida en updateUser');

    const userId = req.params.id;

    console.log("user desde updateUser", userId);

    const updatedUser = req.body;
    //console.log('req.body',req.body)
    console.log("req . body desde updateUser", updatedUser);
  
    const updatedUserResult = await UserService.updateUser(
      userId,
      updatedUser,
      { new: true }
    );

    console.log("updatedUserResult desde updateUser", updatedUserResult);
    if (updatedUserResult) {
      
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } else {
      logger.warn(`Error al actualizar el user: ${error.message}`);
      res.status(404).json({
        error: "user no encontrado o no se realizaron modificaciones",
      });
    }
  } catch (error) {
    logger.error(`Error al actualizar el user: ${error.message}`);

    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUserView = async (req = request, res = response) => {
  try {
    const userId = req.params.id;
    const userUpdated = await UserService.getUsersById({ _id: userId });
    console.log("user desde updateview", userUpdated);

    res.render("updateuser", {
      userUpdated,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`User error: ${error.message}`);
  }
};

export const mail = async (req, res) => {
  const email = req.body.email;
  const redirectBaseUrl = environmentConfig.REDIRECT_URL_LOCAL ;

  const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });


  const resetLink = `${redirectBaseUrl}/updateuserpassword?token=${token}`; // Construir el enlace con el token

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
  res.send(`Se envió un mail para que recupere su contraseña `);
};

export const mailView = async (req, res) => {
  res.render("password", {
    style: "index.css",
    title: "Fitness Ropa deportiva",
  });
};
