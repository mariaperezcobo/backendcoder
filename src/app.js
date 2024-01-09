
import dotenv from 'dotenv'
//dotenv.config()

import { config } from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
config({ path: envPath });


//console.log('MONGO_URL:', process.env.MONGO_URL);
//console.log('MONGO_DBNAME:', process.env.MONGO_DBNAME);

import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './router/views.router.js'
import __dirname from './utils.js'
//import userRouter from './router/users.router.js'
import {Server} from 'socket.io'
//import UserModel from './dao/models/users.model.js'
import passport from 'passport'
import Session from './router/sessionrouter.js'
import initializePassport from './config/passport.config.js'
import otrocart from './router/otrocart.router.js'
import session from 'express-session'

import MongoStore from 'connect-mongo'
import jwtRouter from './router/jwt.router.js'

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


//inicializamos variables
//const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
//const mongodbName = 'ecommerce'

const url = process.env.MONGO_URL
const mongodbName = process.env.MONGO_DBNAME

//console.log('MONGO_URL:', url);
//console.log('MONGO_DBNAME:', mongodbName);

//sesiones
app.use(session({
    
    store: MongoStore.create({
        mongoUrl : url,
        dbName : mongodbName,
        ttl: 100
    }),
    secret: 'secret',
    resave:true,
    saveUninitialized: true

}))


//configurar passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//conectamos a db y corremos el server
mongoose.connect(url, {dbName: mongodbName})
    .then(()=>{
        console.log('DB connected')
    })
    .catch(e=>{
        console.error('error conectando a la base de datos')
    })

   const messages=[]
const PORT = process.env.PORT
const httpServer = app.listen (PORT, ()=> console.log('running..'))
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


  //  App ID: 681168
    //Client ID: Iv1.662a6575b5411586
   // 3608645456c4540155929a3bfce812999d8fc636


//ruta para mongoose
app.use('/productsmongoose', prodMongoose)
app.use('/chatmongoose', chatMongoose)
app.use('/cartmongoose', cartMongoose)
//app.use('/api/cartmongoose', cartMongoose)
app.use('/api/otrocart', otrocart)
app.use('/api/session', Session)

//rutas
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/', viewsRouter)
app.use('/jwt', jwtRouter)
//app.use('/api/user', userRouter)


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










