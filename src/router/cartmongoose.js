//cart con mongoose (la parte de agregar el producto a un carrito esta en otrocart.router)


import {Router} from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/cartmongoose.model.js'
import ProductModel from '../dao/models/productcart.model.js'
import ProductsModel from '../dao/models/prodmongoose.models.js'


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


//para ver los carritos
router.get('/', async (req,res)=>{
    try{
        const carritosmongoose = await CartModel.find().populate('productosagregados.product').lean().exec()
       // console.log(carritosmongoose)
    
        // const result = await ProductsModel.find().lean().exec()
        // result.productsmongoose = result.docs
    
        res.render('cartmongoose',{
            carritosmongoose,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
    
        })
       
    }catch (error){
        console.error('error',error)

    }

})

//para ver un carrito especifico
router.get('/:cid', async (req,res)=>{
   
    try{
                const {cid} = req.params
                const carrito = await CartModel.findById(cid).populate('productosagregados.product').lean().exec();
            //console.log(carrito)

                if(carrito)
                
               // return res.json({carrito});
            //res.status(400).json('el id del carrito no existe'),
            
            res.render('cartone', {
                carrito,
                style: 'index.css',
                title: 'Fitness Ropa deportiva',
            })
            }catch(error){
                console.log('error')
            }
        }
)

//para crear un carrito
router.post('/', async (req,res)=>{
    try{
        const carritoNew = req.body
        const resultcarrito = await CartModel.create(carritoNew)
        res.redirect('/cartmongoose')
    }catch(error){
        console.log(error),
        res.send('error al crear el carrito')
    }
})


//para agregar un producto a un carrito uso el router otrocart.router 




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
// const cart = await CartModel.findById('65624a7bc2dd1e281e93b8c2')
// console.log(cart)
// cart.productosagregados.push({product: '65548d5fc3f09f05e9c4abf9'})
// const result = await CartModel.updateOne({_id:'65624a7bc2dd1e281e93b8c2'}, cart)
// console.log({result})

// const cart = await CartModel.findOne({_id:'65624a7bc2dd1e281e93b8c2'}).populate('productosagregados.product')
// console.log(JSON.stringify(cart, null, '\t'))




export default router
