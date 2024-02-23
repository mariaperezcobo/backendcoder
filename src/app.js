import dotenv from "dotenv";
//import path from 'path';

dotenv.config();

// const envPath= path.resolve(__dirname, '../.env')

import express from "express";
import handlebars from "express-handlebars";

import viewsRouter from "./router/views.router.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import passport from "passport";
import Session from "./router/sessionrouter.js";
import initializePassport from "./config/passport.config.js";
import session from "express-session";
import { generateToken } from "./utils.js";
import MongoStore from "connect-mongo";
import nodemailer from "nodemailer";

//import UserModel from './models/users.model.js'
import mongoose from "mongoose";
import prodMongoose from "./router/prodmongoose.router.js";
import chatMongoose from "./router/chatmongoose.router.js";
import cartMongoose from "./router/cartmongoose.js";
import pruebaErrores from "./controllers/errors.js";

//import { addLogger } from './utils/logger.js';
import logger from "./logging/logger.js";

const app = express();

//Coder
//ivpk gozj dowu gjtv

//configuramos el motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//app.use(addLogger)
app.use("/static", express.static(__dirname + "/public"));

//para trer info de post como json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//inicializamos variables
//const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
//const mongodbName = 'ecommerce'

const url = process.env.MONGO_URL;
const mongodbName = process.env.MONGO_DBNAME;

//console.log('MONGO_URL:', url);
//console.log('MONGO_DBNAME:', mongodbName);

//sesiones
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: url,
      dbName: mongodbName,
      ttl: 100,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//configurar passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//conectamos a db y corremos el server
// mongoose.connect(url, {dbName: mongodbName})
//     .then(()=>{
//         console.log('DB connected')
//     })
//     .catch(e=>{
//         console.error('error conectando a la base de datos')
//     })

const messages = [];
const PORT = process.env.PORT;
const httpServer = app.listen(PORT, () => console.log("running.."));
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("nuevo cliente conectado");
  // socket.on('message', data =>{
  //     console.log(data)

  //     // socket.emit('response', 'mensaje recibido')
  //     // socket.broadcast.emit('mensaje al resto', data)
  //     socketServer.emit('all', data)

  // })
  socket.on("message", (data) => {
    console.log("msj recibido del servidor", data);
    messages.push(data);
    io.emit("logs", messages);
    console.log(data);
  });
});
export { io };

//ruta para mongoose
app.use("/productsmongoose", prodMongoose);
app.use("/chatmongoose", chatMongoose);
app.use("/cartmongoose", cartMongoose);

app.use("/api/session", Session);

//rutas
app.use("/", viewsRouter);

app.get("/loggertest", pruebaErrores);

//rutas mongoose
app.get("/api/userscollection", async (req, res) => {
  const userscollection = await UserModel.find();
  res.json({ status: "success", payload: userscollection });
});

//agregar user a usercollection
app.post("/api/userscollection", async (req, res) => {
  try {
    const dataUser = req.body;
    const resultUser = await UserModel.create(dataUser);
    res.json({ status: "success", payload: resultUser });
  } catch (e) {
    res.status(400).json({ status: "error", error: e });
  }
});

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "mariapcsalem@gmail.com",
    pass: "ivpkgozjdowugjtv",
  },
});

app.get("/mail", (req, res) => {
  res.render("password", {
    style: "index.css",
    messages,
  });
});

// // Función para generar un token único
// function generarTokenUnico() {
//   return uuidv4(); // Utilizamos UUID para generar un token único
// }

app.post("/mail", async (req, res) => {
  const email = req.body.email;
  const token = generateToken({ email }); // Generar el token

  const expiration = Date.now() + 120000; //3600000;
  req.session.passwordReset = { token, expiration, email };

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
