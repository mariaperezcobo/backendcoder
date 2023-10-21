import express from 'express'
import routerProducts from './router/products.router.js'
import routerCarts from './router/cart.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

app.get ('/', (req, res)=> res.send('ok'))




app.listen (8080, ()=> console.log('running..'))
