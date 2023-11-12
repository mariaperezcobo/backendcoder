
import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './router/views.router.js'
import __dirname from './utils.js'
import userRouter from './router/users.router.js'
import {Server} from 'socket.io'
// import UserModel from './models/users.model.js'
// import mongoose from 'mongoose'

const app = express()

app.engine('handlebars', handlebars.engine())
// app.set('views', './views')
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

app.use('/', viewsRouter)

app.use('/api/user', userRouter)

//mongoose
// app.get('/api/userscollection', async (req, res)=>{
// const userscollection = await UserModel.find()
// res.json ({status: 'success', payload: userscollection})
// })

//agregar user a usercollection
// app.post('/api/userscollection', async (req, res)=>{
//     try{
//         const dataUser = req.body
//         const resultUser = await UserModel.create(dataUser)
//         res.json ({status: 'success', payload: resultUser})
//     } catch (e) {
//         res.status(400).json({status:'error', error:e})
//     }
  
//     })

// const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'

// mongoose.connect(url, {dbName:'clase14'})
//     .then(()=>{
//         console.log('DB connected')
//     })
//     .catch(e=>{
//         console.error('error conectando a la base de datos')
//     })

   

    const httpServer = app.listen (8080, ()=> console.log('running..'))

    const io = new Server (httpServer)

    io.on('connection', async socket =>{
        console.log('nuevo cliente conectado')
    
        // socket.on('message', data =>{
        //     console.log(data)
    
        //     // socket.emit('response', 'mensaje recibido')
        //     // socket.broadcast.emit('mensaje al resto', data)
        //     socketServer.emit('all', data)
            
        // })
    })
    export {io}








