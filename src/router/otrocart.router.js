//es la segunda parte del cartmongoose. aca es para ue por posman pueda agregar un producto al carrito. este no renderiza en html con formato

import {Router} from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/cartmongoose.model.js'

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


// //para ver los carritos
// router.get('/', async (req,res)=>{
//     try{
//         const carts = await CartModel.find().populate('productosagregados.product').lean().exec()
    
//         res.send(carts)
//         //console.log(carts)
//     }catch (err){
//         res.send('error al cargar carrito')
//         res.status(500).send('Error al cargar los carritos. Por favor, inténtalo de nuevo más tarde.');
//     }
//     }

// )

//para ver un id de carrito
// router.get('/:cid', async (req,res)=>{
    
//         try{
               
//             const cid = req.params.cid

//             const cartBuscado = await CartModel.findById(cid).populate('productosagregados.product').lean().exec();
//             //console.log(cartBuscado)
//             if(!cartBuscado){
//                 res.status(404).json({error: 'cart not found', details: error.message})
//             }else{
//                 res.json(cartBuscado)
//             }
            
    
//         }catch (error){
//             res.status(500).json({error: 'error 2', details: error.message})
//            }  
//     }
// )



//agregar un producto a un carrito
//el carrito lo creo desde la pagina /cartmongoose
// router.post('/:cid/product/:pid', async (req,res)=>{
    
//     try{
           
//         const cid = req.params.cid
//         const pid = req.params.pid

//         const carrito = await CartModel.findById(cid).exec();
//         //console.log('param', cid, pid)

//         if(!carrito){
//             res.status(404).json({error: 'cart not found' })
//         }
//         //console.log('cart',carrito)

//         // const productoIndex = carrito.productosagregados.findIndex(p => p.product.toString() === pid);

//         // if (productoIndex !== -1) {
//         //     // Si el producto ya está en el carrito, aumenta la cantidad
//         //     carrito.productosagregados[productoIndex].quantity++;
//         // } else {
//         //     // Si no está en el carrito, agrega el producto con cantidad 1
//         //     carrito.productosagregados.push({ product: pid, quantity: 1 });
//         // }

//         const productoInCart = carrito.productosagregados.find(p => p.product._id.toString() === pid);
//         //console.log(productoInCart)
//         if (productoInCart){
//             productoInCart.quantity++;
//         }
        
//     else{
//         const newProduct = { product: pid, quantity: 1}
//         carrito.productosagregados.push(newProduct);
//     }
      

//        await carrito.save();

//         return res.json({ msg: 'Carrito actualizado!', carrito });

//     }catch (error){
//         console.error('error al agregar un prod', error)
//         res.status(500).json({error: 'error 3', details: error.message})
//        }  
// }
// )

//para eliminar un producto del carrito
// router.delete('/:cid/product/:pid', async (req,res)=>{
//    try{
//     const cid = req.params.cid
//     const pid = req.params.pid

//     const carrito = await CartModel.findById(cid).exec();

//     if(!carrito){
//         return res.status(404).json({ error: 'cart not found' });
//     }
   
//         const productoInCart = carrito.productosagregados.filter(p => p.product._id.toString() !== pid);
//         if(!productoInCart){
//             return res.status(404).json({ error: 'product not found' });
//         }

        
//         carrito.productosagregados = productoInCart
//         await carrito.save()
        
//         return res.json({ msg: 'carrito actualizado!', carrito });

//    }catch (error){
//     console.error('error', error);
//     return res.status(500).json({ error: 'error', details: error.message });
//    }

// })

//para eliminar carrito
// router.delete('/:cid', async (req,res)=>{
//     try{
//      const cid = req.params.cid
      
//      const carrito = await CartModel.findById(cid).exec();
 
//      if(!carrito){
//          return res.status(404).json({ error: 'cart not found' });
//      }
    
                        
//          carrito.productosagregados = []
//          await carrito.save()
         
//          return res.json({ msg: 'carrito actualizado!', carrito });
 
//     }catch (error){
//      console.error('error', error);
//      return res.status(500).json({ error: 'error', details: error.message });
//     }
 
//  })



//para actualizar la cantidad de producto de un carrito
router.put('/:cid/product/:pid', async (req,res)=>{
    try{
        const cid = (req.params.cid)
        const pid = (req.params.pid)
        const carrito = await CartModel.findById(cid).exec();
    
        if(!carrito){
            return res.status(404).json({ error: 'cart not found' });
        }
            
        const newQuantity = req.body.quantity
    
        if (!newQuantity || isNaN(newQuantity)){
            return res.status(400).json({error: 'faltan datos'})
        }
    
        const productoIndex = carrito.productosagregados.findIndex(p => p.product._id.toString() === pid);
        if(!productoIndex){
            return res.status(404).json({ error: 'product not found' });
        }
        carrito.productosagregados[productoIndex].quantity = newQuantity
        await carrito.save()
        res.json ({status:'succes', message: 'product updated'})
        
    } catch(error){
        console.error('error', error);
        return res.status(500).json({ error: 'error', details: error.message });
    }
    
   
   
})


export default router