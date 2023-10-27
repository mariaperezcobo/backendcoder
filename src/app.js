import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'
import handlebars from 'express-handlebars'
import viewsRouter from './router/views.router.js'
import __dirname from './utils.js'

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



app.listen (8080, ()=> console.log('running..'))
