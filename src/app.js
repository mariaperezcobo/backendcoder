
import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './router/views.router.js'
import __dirname from './utils.js'
import userRouter from './router/users.router.js'
import {Server} from 'socket.io'
import UserModel from './dao/models/users.model.js'
import usuarioRouter from './router/usuario.router.js'

//import UserModel from './models/users.model.js'
import mongoose from 'mongoose'
import prodMongoose from './router/prodmongoose.router.js'
import chatMongoose from './router/chatmongoose.router.js'
import cartMongoose from './router/cartmongoose.js'

const app = express()

//configuramos el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))

//para trer info de post como json
app.use(express.json())
app.use(express.urlencoded({extended: true}))




//ruta para mongoose
app.use('/productsmongoose', prodMongoose)
app.use('/chatmongoose', chatMongoose)
app.use('/cartmongoose', cartMongoose)

//rutas
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/', viewsRouter)
app.use('/api/user', userRouter)
app.use('/pagination', usuarioRouter)

//rutas mongoose
app.get('/api/userscollection', async (req, res)=>{
const userscollection = await UserModel.find()
res.json ({status: 'success', payload: userscollection})
})

//agregar user a usercollection
app.post('/api/userscollection', async (req, res)=>{
    try{
        const dataUser = req.body
        const resultUser = await UserModel.create(dataUser)
        res.json ({status: 'success', payload: resultUser})
    } catch (e) {
        res.status(400).json({status:'error', error:e})
    }
  
    })

//inicializamos variables
const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
const mongodbName = 'ecommerce'

//conectamos a db y corremos el server
mongoose.connect(url, {dbName: mongodbName})
    .then(()=>{
        console.log('DB connected')
    })
    .catch(e=>{
        console.error('error conectando a la base de datos')
    })

   const messages=[]

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
        socket.on('message', data=>{
                console.log('msj recibido del servidor', data)
                messages.push(data)
                io.emit('logs', messages)
                console.log(data)
            })
    })
    export {io}








