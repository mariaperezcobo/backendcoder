//cart con filesistem


import {Router} from 'express'
import {io} from '../app.js'

const router = Router()


  
//    cuando lleguen, los agrego a la base de datos y los emito a los demas
    socket.on('message', data=>{
        console.log('msj recibido del servidor', data)
        messages.push(data)
        io.emit('logs', messages)
        console.log(data)
    })


 


export default router

