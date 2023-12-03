
import {Router} from 'express'
import UserRegisterModel from '../dao/models/userregister.model.js'

const router = Router()

router.post('/login', async (req,res)=>{
    try{
        const {email, password} = req.body
        const usuario = await UserRegisterModel.findOne({email, password})
    
        if(!usuario) return res.status(404).send('user not found')
       
        req.session.usuario = usuario
        res.redirect('/profile')
    }catch(error){
        console.error('error al ingresar', error)
    }
 

})

router.post('/registeruser', async (req,res)=>{
    try{
        const usuario = req.body
        await UserRegisterModel.create(usuario)
    
        return res.redirect('/profile')
    }catch (error){
        console.error('error al registrarse', error)
    }
    
   
})



export default router