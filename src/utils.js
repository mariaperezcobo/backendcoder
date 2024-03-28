import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// export const createHash =  (password)=>{
//     return  bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// }

export const createHash = (password) => {
  try {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  } catch (error) {
    console.error("Error al generar el hash:", error);
    throw error; // Propaga el error hacia arriba
  }
};

export const isValidPassword = (usuario, password) => {
  return bcrypt.compareSync(password, usuario.password);
};

const PRIVATE_KEY = "secret";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  console.log(" token desde utils generate token", token);
  return token;
};

export const authToken = (req, res, next) => {
  // const token = req.headers.auth
  const token = req.cookies["jwt"];

  if (!token) return res.status(401).send({ error: "not auth" });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "not authorized" });
    req.user = credentials.user;
    next();
  });
};

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "mariapcsalem@gmail.com",
    pass: "ivpkgozjdowugjtv",
  },
});

//stripe
//pk_test_51OvqE5P6ivAJFcXxAUm3XgE7NIzeLmRkj5yFjsI8XqOa6pu3QHcYpqcRxdP8whRr6KYFKtJWOOv6UEz5M20EfBr100cpCkuwRB

//privada
//sk_test_51OvqE5P6ivAJFcXxx3RGgideVFuqIupAADPCjhfDQY95DI0tZ2kWMAJlMkcVXemAwCq08IlEYatko3Gj7otemutx00Kjzj4kEO
