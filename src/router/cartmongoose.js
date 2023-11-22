import {Router} from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/cartmongoose.model.js'
import ProductModel from '../dao/models/productcart.model.js'


//inicializamos variables
const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
const mongodbName = 'ecommerce'

//conectamos a db y corremos el server
await mongoose.connect(url, {dbName: mongodbName})
    .then(()=>{
        console.log('DB connected')
    })
    .catch(e=>{
        console.error('error conectando a la base de datos')
    })

const router = Router()

// const result = await ProductModel.create({
//     title: 'producto1'
// })
// console.log(result)
//655e5ec1e05701b8254206ed

// const result2 = await CartModel.create({
//     title: 'pablo'
// })
// console.log(result2)
//655e22a57a08d8cfdddb6e79

//
// const cart = await CartModel.findById('655e22a57a08d8cfdddb6e79')
// console.log(cart)
// cart.productosagregados.push({product: '655e5ec1e05701b8254206ed'})
// const result = await CartModel.updateOne({_id:'655e22a57a08d8cfdddb6e79'}, cart)
// console.log({result})

const cart = await CartModel.findById('655e22a57a08d8cfdddb6e79').populate('productosagregados.product')
console.log(JSON.stringify(cart, null, '\t'))

// // router.get('/', async (req,res)=>{
// //     const carritosmongoose = await CartModel.find().lean().exec()
// //     console.log(carritosmongoose)

// //     res.render('cartmongoose',{
// //         carritosmongoose,
// //         style: 'index.css',
// //         title: 'Fitness Ropa deportiva',

// //     })
// // })

// // router.post('/', async (req,res)=>{
// //     try{
// //         const carritoNew = req.body
// //         const resultcarrito = await CartModel.create(carritoNew)
// //         res.redirect('/cartmongoose')
// //     }catch(error){
// //         console.log(error),
// //         res.send('error al crear el carrito')
// //     }
// // })



export default router
