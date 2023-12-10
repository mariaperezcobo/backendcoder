
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




router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send('logout error')
        return res.redirect('/')
    })
})


router.get(
    '/github', 
    passport.authenticate('github', {scope:['user:email']}),
   async (req,res)=>{
    
})

router.get('/error', (req,res)=> res.send('pagina de error'))

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/error'}),
    (req,res)=>{
        console.log('Callback:', req.user)
        req.session.user = user
        console.log('user session setted')
        res.redirect('/')

})


export default router