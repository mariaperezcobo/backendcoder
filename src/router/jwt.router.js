import Router from 'express'
import { generateToken, authToken } from '../utils.js'
import UserRegisterModel from '../dao/models/userregister.model.js'

const router = Router()

// router.post('/registeruser', async (req,res)=>{
//     const user = req.body   
//     const result = await UserRegisterModel.create(user)
//     console.log({result})
    
//     const access_token = generateToken(result)
//     res.send({status: 'success', access_token})

// })

// router.post('/login', async(req,res)=>{
//     const {email, password} = req.body
//     const user = await UserRegisterModel.findOne({email, password})
//     if(!user) res.status(400).send({status:'error', error:'invalid credentials'})
    
//     const access_token = generateToken(user)

//     res.send({status: 'success', access_token})

// })

// router.get('/private', authToken, (req,res)=>{

//     res.send({status: 'success', payload: req.user})
// })


export default router