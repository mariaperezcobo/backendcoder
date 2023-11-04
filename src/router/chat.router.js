import {Router} from 'express'
import {io} from '../app.js'

const router = Router()


  
    // cuando lleguen, los agrego a la base de datos y los emito a los demas
    socket.on('message', data=>{
        messages.push(data)
        io.emit('logs', messages)
        console.log(data)
    })

// io.on('connection', async socket =>{
//     console.log('nuevo cliente conectado')
  
//     // cuando lleguen, los agrego a la base de datos y los emito a los demas
//     socket.on('message', data=>{
//         messages.push(data)
//         io.emit('logs', messages)
//         console.log(data)

//     })
// })

export default router