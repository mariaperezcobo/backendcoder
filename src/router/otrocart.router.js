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
        const carts = await CartModel.find().lean().exec()
    
        res.send(carts)
    }catch (err){
        res.send('error')
    }
    }

)

//para ver un id de carrito
router.get('/:cid', async (req,res)=>{
    
        try{
               
            const cid = req.params.cid

            const cartBuscado = await CartModel.findById(cid).lean().exec();
            if(!cartBuscado){
                res.status(404).json({error: 'cart not found', details: error.message})
            }else{
                res.json(cartBuscado)
            }
            
    
        }catch (error){
            res.status(500).json({error: 'error', details: error.message})
           }  
    }
)

//agregar un producto a un carrito
//el carrito lo creo desde la pagina /cartmongoose
router.post('/:cid/product/:pid', async (req,res)=>{
    
    try{
           
        const cid = req.params.cid
        const pid = req.params.pid

        const carrito = await CartModel.findById(cid).exec();
        console.log('param', cid, pid)

        if(!carrito){
            res.status(404).json({error: 'cart not found' })
        }
        console.log('cart',carrito)
        const productoInCart = carrito.productosagregados.find(p => p.id.toString() === pid);

        if (productoInCart)
        productoInCart.quantity++;
    else
        carrito.productosagregados.push({ id: pid, quantity: 1 });

       await carrito.save();

        return res.json({ msg: 'Carrito actualizado!', carrito });

    }catch (error){
        console.error('error', error)
        res.status(500).json({error: 'error', details: error.message})
       }  
}
)







export default router