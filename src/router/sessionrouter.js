
import {Router} from 'express'
import UserRegisterModel from '../dao/models/userregister.model.js'

import passport from 'passport'
import { createHash, isValidPassword } from '../utils.js'


const router = Router()

// Middleware
function auth (req, res, next) {
    if (req.session?.user) return next()

    res.status(401).send('Not Authenticate')
}

// router.post('/login', async (req,res)=>{
//     try{
//         // const {email, password} = req.body
//         // //const usuario = await UserRegisterModel.findOne({email, password})
//         // const usuario = await UserRegisterModel.findOne({email})
//         // if(!usuario) return res.status(404).send('user not found')
//         // if(!isValidPassword(usuario,password)) return res.status(404).send('password invalido')
//         // req.session.usuario = usuario
//         // console.log('usuario almacenado en sesion', req.session.usuario)
//         // res.redirect('/productsmongoose')

//     }catch(error){
//         console.error('error al ingresar', error)
//     }

// })

router.post(
    '/login', 
    passport.authenticate('login', {failureRedirect: '/'}), 
    async (req,res)=>{
        if(!req.user) return res.status(400).send('invalid credentials')
        req.session.user = req.user
        return res.send('logged')
        
})

router.post(
    '/registeruser', 
    passport.authenticate('registeruser', {failureRedirect: '/'}),
    async (req,res)=>{
        res.send('registrado')
    
   
})




// router.post('/registeruser', async (req,res)=>{
//     try{
//         const usuario = req.body

               
//         if(usuario.email === 'adminCoder@coder.com' && usuario.password === 'adminCod3r123') {
//             usuario.rol = 'admin'
//         }
        
//         usuario.password = createHash(usuario.password)
        
//         await UserRegisterModel.create(usuario)
    
//         console.log('usuario creado', usuario)
//         return res.redirect('/profile')
//     }catch (error){
//         console.error('error al registrarse', error)
//     }
    
   
// })

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send('logout error')
        return res.redirect('/')
    })
})


export default router