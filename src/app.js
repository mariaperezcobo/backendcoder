
import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './router/views.router.js'
import __dirname from './utils.js'
import userRouter from './router/users.router.js'


import {Server} from 'socket.io'


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
// app.use('/api/home', homeRouter)

// app.listen (8080, ()=> console.log('running..'))
const httpServer = app.listen (8080, ()=> console.log('running..'))
const io = new Server (httpServer)

const messages= []

io.on('connection', async socket =>{
    console.log('nuevo cliente conectado')

    // socket.on('message', data =>{
    //     console.log(data)

    //     // socket.emit('response', 'mensaje recibido')
    //     // socket.broadcast.emit('mensaje al resto', data)
    //     socketServer.emit('all', data)
        
    // })


    //cuando lleguen, los agrego a la base de datos y los emito a los demas
    // socket.on('message', data=>{
    //     console.log(data)
    //     messages.push(data) //
    //     io.emit('logs', messages)//para emitir a los demas
    // })

})

export {io}

