import passport from "passport";
import local from 'passport-local'
import UserRegisterModel from "../dao/models/userregister.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'
import CartModel from "../dao/models/cartmongoose.model.js";
import { CartService, UserService } from "../services/index.js";

const LocalStrategy = local.Strategy

const initializePassport =()=>{


    //github strategy
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.662a6575b5411586',
        clientSecret: '3608645456c4540155929a3bfce812999d8fc636',
        callbackURL: 'http://127.0.0.1:8080/githubcallback',
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log(profile);

        try{
            const user = await UserRegisterModel.findOne({email: profile._json.email})
            if (user) {
                console.log('ya se encuentra registrado')
                return done(null, user)
            }

            const newUser = await UserRegisterModel.create({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: '',
                password: ''
            })

            return done (null, newUser)
            
        }catch(error){
            return done('error to login with github', error)
        }
    }))


    //local estrategy
    
    passport.use('registeruser', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
 

        const {first_name, last_name, age, rol, email} = req.body
        try{
            //const user = await UserRegisterModel.findOne({email: username})

            const user = await UserService.getUsers(username)
            //console.log('usuario', user)

            if (!email) {
                console.log('Email es nulo o indefinido');
                return done(null, false);
            }

            if(user){
                console.log('user already exist')
                return done(null,false)
            }

            const newUser ={
                first_name,
                last_name,
                age,
                rol,
                email,
                password: createHash(password)
            }

            //console.log('Datos del nuevo usuario:', newUser);

            // Crear el usuario en la base de datos
          //const result = await UserRegisterModel.create(newUser)    
          
           // const result = await UserRegisterModel.create(newUser)  
           const result = await UserService.addUsers(newUser);
           // console.log('usuario agregado', result)
       

        

    // Añadir el carrito al usuario
    const carrito = await CartService.addCart({ productosagregados: [] });
    result.cart = carrito.id;
   // console.log('carrito', carrito)
  
    // Actualizar el usuario con el ID del carrito
    await result.save();
console.log('carrito de la sesion', result)
        //const carrito = await CartModel.create({ productosagregados: [] })
     
    
     //   console.log('Datos del nuevo usuario con carrito:', newUser);
      

        //    console.log('result', result)
            return done(null, result)

         
        }catch(error){
            done('error to register', error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done)=>{
        try{
            const user = await UserService.getUsers(username)

           // console.log('usuario', user)
            if(!user){
                console.error('user doesnt exist')
                return done (null, false)
            }

            if(!isValidPassword(user, password)){
                console.error('password not valid')
                return done(null, false)
            }
           // console.log('usruario:', user)
            return done(null, user)
        }catch(error){
            console.error('Error during login en passport:', error);
            return done('error login', error)
        }
    }))



    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done)=>{
        //const user = await UserRegisterModel.findById(id)
        const user = await UserService.getUsers(id)
        done(null, user)
    })


}



export default initializePassport