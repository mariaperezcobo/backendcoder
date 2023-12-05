
import {Router} from 'express'
import UserRegisterModel from '../dao/models/userregister.model.js'

const router = Router()

router.post('/login', async (req,res)=>{
    try{
        const {email, password} = req.body
        const usuario = await UserRegisterModel.findOne({email, password})
    
        if(!usuario) return res.status(404).send('user not found')
       
        req.session.usuario = usuario
        console.log('usuario almacenado en sesion', req.session.usuario)
        res.redirect('/productsmongoose')
    }catch(error){
        console.error('error al ingresar', error)
    }
 

})

router.post('/registeruser', async (req,res)=>{
    try{
        const usuario = req.body
       
        if(usuario.email === 'adminCoder@coder.com' && usuario.password === 'adminCod3r123') {
            usuario.rol = 'admin'
        }
        
        await UserRegisterModel.create(usuario)
    
        console.log('usuario creado', usuario)
        return res.redirect('/profile')
    }catch (error){
        console.error('error al registrarse', error)
    }
    
   
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.send('logout error')
        return res.redirect('/')
    })
})


export default router