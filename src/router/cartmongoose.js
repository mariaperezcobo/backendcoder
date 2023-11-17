import {Router} from 'express'
import CartModel from '../dao/models/cartmongoose.model.js'
import productModel from '../dao/models/productcart.model.js'



const router = Router()

const result = await productModel.create({
    title: 'juana'
})
console.log(result)

// const result2 = await CartModel.create({
//     title: 'pablo'
// })
// console.log(result2)

// const cart = await CartModel.findById('65572f2fc631dd86f2e6a2f2')
// console.log(cart)
// carritos.productosagregados.push({product: })
//const result = await CartModel.updateOne({_id:''}, cart)

// router.get('/', async (req,res)=>{
//     const carritosmongoose = await CartModel.find().lean().exec()
//     console.log(carritosmongoose)

//     res.render('cartmongoose',{
//         carritosmongoose,
//         style: 'index.css',
//         title: 'Fitness Ropa deportiva',

//     })
// })

// router.post('/', async (req,res)=>{
//     try{
//         const carritoNew = req.body
//         const resultcarrito = await CartModel.create(carritoNew)
//         res.redirect('/cartmongoose')
//     }catch(error){
//         console.log(error),
//         res.send('error al crear el carrito')
//     }
// })



export default router
