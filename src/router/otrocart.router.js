//es la segunda parte del cartmongoose. aca es para ue por posman pueda agregar un producto al carrito. este no renderiza en html con formato

// import {Router} from 'express'
// import mongoose from 'mongoose'
// import CartModel from '../dao/models/cartmongoose.model.js'

// import ProductsModel from '../dao/models/prodmongoose.models.js'


// //inicializamos variables
// const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
// const mongodbName = 'ecommerce'

// //conectamos a db y corremos el server
// await mongoose.connect(url, {dbName: mongodbName})
//     .then(()=>{
//         console.log('DB connected')
//     })
//     .catch(e=>{
//         console.error('error conectando a la base de datos')
//     })

// const router = Router()





// //para actualizar la cantidad de producto de un carrito
// router.put('/:cid/product/:pid', async (req,res)=>{
//     try{
//         const cid = (req.params.cid)
//         const pid = (req.params.pid)
//         const carrito = await CartModel.findById(cid).exec();
    
//         if(!carrito){
//             return res.status(404).json({ error: 'cart not found' });
//         }
            
//         const newQuantity = req.body.quantity
    
//         if (!newQuantity || isNaN(newQuantity)){
//             return res.status(400).json({error: 'faltan datos'})
//         }
    
//         const productoIndex = carrito.productosagregados.findIndex(p => p.product._id.toString() === pid);
//         if(!productoIndex){
//             return res.status(404).json({ error: 'product not found' });
//         }
//         carrito.productosagregados[productoIndex].quantity = newQuantity
//         await carrito.save()
//         res.json ({status:'succes', message: 'product updated'})
        
//     } catch(error){
//         console.error('error', error);
//         return res.status(500).json({ error: 'error', details: error.message });
//     }
    
   
   
// })


// export default router