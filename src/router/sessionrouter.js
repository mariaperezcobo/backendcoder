
import {Router} from 'express'
import UserRegisterModel from '../dao/models/userregister.model.js'
import passport from 'passport'
import { createHash, isValidPassword } from '../utils.js'
import { logOutSession, loginUser, registerUser } from '../controllers/sessions.js'

const router = Router()

//Middleware
function auth (req, res, next) {
    if (req.session?.user) return next()

    res.status(401).send('Not Authenticate')
}


router.post('/login',  loginUser )

// router.post(
//     '/login', 
//     passport.authenticate('login', {failureRedirect: '/'}), 
//        async (req,res)=>{
//         if(!req.user) return res.status(400).send('invalid credentials')
//         req.session.user = req.user
//         return res.redirect('/productsmongoose')
        
//         //return res.send('logged')
        
// })

router.post('/registeruser', registerUser)

// router.post(
//     '/registeruser', 
//     passport.authenticate('registeruser', {failureRedirect: '/'}),
//     async (req,res)=>{
//        // res.send('registrado')
//        console.log('usuario registrado')
//        res.redirect('/login')
   
// })




router.get('/logout', logOutSession)

// router.get('/logout', (req,res)=>{
//     req.session.destroy(err=>{
//         if(err) return res.send('logout error')
//         return res.redirect('/')
//     })
// })


export default router