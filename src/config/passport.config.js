import passport from "passport";
import local from 'passport-local'
import UserRegisterModel from "../dao/models/userregister.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from 'passport-github2'


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



    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done)=>{
        const user = await UserRegisterModel.findById(id)
        done(null, user)
    })


}



export default initializePassport