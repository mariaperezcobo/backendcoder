import passport from "passport";
import local from "passport-local";
import UserRegisterModel from "../dao/models/userregister.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
// import CartModel from "../dao/models/cartmongoose.model.js";
import { CartService, UserService } from "../services/index.js";
import UserInsertDTO from "../DTO/users.dto.js";
import passportJWT from "passport-jwt";
import { generateToken } from "../utils.js";
import session from "express-session";

const LocalStrategy = local.Strategy;

const JWTStrategy = passportJWT.Strategy;

const initializePassport = () => {
  //github strategy
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.662a6575b5411586",
        clientSecret: "3608645456c4540155929a3bfce812999d8fc636",
        callbackURL: "http://127.0.0.1:8080/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
          const user = await UserRegisterModel.findOne({
            email: profile._json.email,
          });
          if (user) {
            console.log("ya se encuentra registrado");
            return done(null, user);
          }

          const newUser = await UserRegisterModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: "",
            password: "",
          });

          return done(null, newUser);
        } catch (error) {
          return done("error to login with github", error);
        }
      }
    )
  );

  //local estrategy

  // passport.use(
  //   "registeruser",
  //   new LocalStrategy(
  //     {
  //       passReqToCallback: true,
  //       usernameField: "email",
  //     },
  //     async (req, username, password, done) => {
  //       const { first_name, last_name, age, rol, email } = req.body;
  //       try {
  //         //const user = await UserRegisterModel.findOne({email: username})

  //         const user = await UserService.getUsers(username);
  //         //console.log('usuario 2', user)

  //         if (!email) {
  //           console.log("Email es nulo o indefinido");
  //           return done(null, false);
  //         }

  //         if (user) {
  //           console.log("user already exist", user);
  //           return done(null, false, { message: "User already exists" });
  //         }
  //         const rolValue = rol || "user";

  //         const newUser = {
  //           first_name,
  //           last_name,
  //           age,
  //           rol: rolValue,
  //           email,
  //           password: createHash(password),
  //         };

  //         //console.log('Datos del nuevo usuario:', newUser);

  //         // Crear el usuario en la base de datos
  //         //const result = await UserRegisterModel.create(newUser)

  //         // const result = await UserRegisterModel.create(newUser)

  //         const newUserDTO = new UserInsertDTO(newUser);

  //         const result = await UserService.addUsers(newUserDTO);
  //         console.log("usuario agregado", result);

  //         // Añadir el carrito al usuario
  //         const carrito = await CartService.addCart({ productosagregados: [] });

  //         result.cart = carrito.id;
  //         // console.log('carrito', carrito)
  //         console.log("carrito desde passport", carrito);
  //         console.log("result desp de incorporar carrito", result);

  //         result.last_connection = new Date();

  //         // Actualizar el usuario con el ID del carrito
  //         //await result.save();

  //         // Actualiza el usuario con el ID del carrito
  //         await UserService.updateUser(result._id, {
  //           cart: carrito.id,
  //           last_connection: result.last_connection,
  //         });

  //         //const carrito = await CartModel.create({ productosagregados: [] })

  //         //   console.log('Datos del nuevo usuario con carrito:', newUser);

  //         console.log("result de passport config", result);
  //         return done(null, result);
  //       } catch (error) {
  //         done("error to register", error);
  //         console.error("Error al registrar usuario:", error);
  //       }
  //     }
  //   )
  // );

  //lo elimine para probar jwt
  // passport.use(
  //   "login",
  //   new LocalStrategy(
  //     {
  //       usernameField: "email",
  //     },
  //     async (username, password, done) => {
  //       try {
  //         //          console.log('Email proporcionado:', username);
  //         //console.log('Contraseña proporcionada:', password);
  //         const user = await UserService.getUsers(username);
  //         //   console.log('Email proporcionado:', username);
  //         //       console.log('Contraseña proporcionada:', password);
  //         //    console.log('usuario', user)
  //         if (!user) {
  //           console.error("user doesnt exist");
  //           return done(null, false);
  //         }

  //         if (!isValidPassword(user, password)) {
  //           console.error("password not valid");
  //           return done(null, false);
  //         }

  //         user.last_connection = new Date();

  //         const updatedUserResult = await UserService.updateUser(
  //           user._id,
  //           { last_connection: user.last_connection },
  //           { new: true }
  //         );

  //         if (!updatedUserResult) {
  //           console.error("Error updating user last_connection");
  //           return done("Error updating user last_connection", null);
  //         }

  //         // console.log('usruario:', user)
  //         return done(null, updatedUserResult);
  //       } catch (error) {
  //         console.error("Error during login en passport:", error);
  //         return done("error login", error);
  //       }
  //     }
  //   )
  // );

  const cookieExtractor = (req, res) => {
    console.log("cookie extractor");
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["jwt"];
      console.log("token", token);
    }

    return token || null;
  };

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: "secret",
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
          cookieExtractor,
        ]),
      },
      async (jwt_payload, done) => {
        console.log("payload", jwt_payload);

        try {
          // console.log("payload", jwt_payload);
          const user = await UserService.getUsers(jwt_payload.user.email);

          //  console.log("usuario desde passport", user);
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          console.error("Error al buscar al usuario:", error);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    //const user = await UserRegisterModel.findById(id)
    const user = await UserService.getUsers(id);
    done(null, user);
  });
};

export default initializePassport;
