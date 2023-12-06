import passport from "passport";
import local from 'passport-local'
import UserRegisterModel from "../dao/models/userregister.model.js";
import { createHash, isValidPassword } from "../utils.js";


const LocalStrategy = local.Strategy

const initializePassport = () =>{

    passport.use('registeruser', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const {first_name, last_name, age, rol, email} = req.body
        try{
            const user = await UserRegisterModel.findOne({email: username})
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

            const result = await UserRegisterModel.create(newUser)
            return done(null, result)


        }catch(error){
            done('error to register', error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done)=>{
        try{
            const user = await UserRegisterModel.findOne({email: username}).lean().exec()
            if(!user){
                console.error('user doesnt exist')
                return done (null, false)
            }

            if(!isValidPassword(user, password)){
                console.error('password not valid')
                return done(null, false)
            }

            return done(null, user)
        }catch(error){
            return done('error login', error)
        }
    }))




    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        const user = await UserRegisterModel.findById(id)
        done(null, user)
    })

}

export default initializePassport