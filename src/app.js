import dotenv from "dotenv";

dotenv.config();


import express from "express";
import handlebars from "express-handlebars";
import viewsRouter from "./router/views.router.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import Session from "./router/sessionrouter.js";
import initializePassport from "./config/passport.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";


import prodMongoose from "./router/prodmongoose.router.js";
import chatMongoose from "./router/chatmongoose.router.js";
import cartMongoose from "./router/cartmongoose.js";
import pruebaErrores from "./controllers/errors.js";
import paymentRouter from "./router/payments.router.js";

const app = express();
app.use(cors());
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

// Middleware de análisis de cookies
app.use(cookieParser());

// Middleware de autenticación que se aplica a todas las rutas

app.use(
  cors({
    methods: ["GET", "POST"], // Establece los métodos HTTP permitidos
    credentials: true, // Habilita el envío de cookies en las solicitudes CORS
  })
);

//inicializamos variables
const url = process.env.MONGO_URL;
const mongodbName = process.env.MONGO_DBNAME;

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



const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación",
      description: "Proyecto de venta de ropa deportiva",
    },
  },
  apis: [`${__dirname}/./docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));

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

//ruta
app.use("/productsmongoose", prodMongoose);
app.use("/chatmongoose", chatMongoose);
app.use("/cartmongoose", cartMongoose);
app.use("/api/session", Session);
app.use("/", viewsRouter);
app.get("/loggertest", pruebaErrores);

//rutas mongoose
// app.get("/api/userscollection", async (req, res) => {
//   const userscollection = await UserModel.find();
//   res.json({ status: "success", payload: userscollection });
// });

app.use("/api/payments", paymentRouter);



