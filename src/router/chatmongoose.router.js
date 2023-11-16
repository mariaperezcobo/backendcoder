import { Router } from 'express'
import ChatModel from '../dao/models/chatmongoose.models.js'

const router = Router()

router.get('/', async (req,res)=>{
    const contenidochat = await ChatModel.find().lean().exec()
    console.log({contenidochat})

    res.render('chatmongoose', {
        contenidochat,
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    })
})

router.post('/', async (req,res)=>{
    try{
        const chatmongooseNew = req.body
        const resultadochat = await ChatModel.create(chatmongooseNew)
        console.log(resultadochat)
        res.redirect('/chatmongoose')
    }catch(error){
        console.log(error)
        res.send('Error al enviar el mensaje')
    }
})


export default router