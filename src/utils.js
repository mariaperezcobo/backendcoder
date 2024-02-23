import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

const PRIVATE_KEY = "CoderHouseMy_S3Crttt_ as";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

export const authToken = (req, res, next) => {
  const token = req.headers.auth;

  if (!token) return res.status(401).send({ error: "not auth" });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "not authorized" });
    req.user = credentials.user;
    next();
  });
};
