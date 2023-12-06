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
             // console.log(carrito)
               //  console.log(cid)

            if(!carrito){
                return res.status(404).json({ error: 'cart not found' });
            }
            carrito.productosagregados.forEach(product => {
                product.cid = cid;
            });
               // return res.json({carrito});
            //res.status(400).json('el id del carrito no existe'),
            
            res.render('cartone', {
                carrito,
                cid,
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



//para eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req,res)=>{
    try{
     const cid = req.params.cid
     const pid = req.params.pid
 
     const carrito = await CartModel.findById(cid).exec();
 
     console.log(cid)
 
    
carrito.productosagregados = carrito.productosagregados.filter(p => p._id.toString() !== pid);
console.log('carrito actualizado antes de save', carrito) 

// carrito.productosagregados = carrito.productosagregados.filter(p => {
//     console.log('Comparando _id:', p._id.toString(), 'con pid:', pid);
//     return p._id.toString() !== pid;
// });
console.log('carrito despues del filtro', carrito) 

          await carrito.save()

       //  console.log('carrito actualizado', carrito) 
         return res.status(204).json({ message: 'Eliminación exitosa' });


    }catch (error){
     console.error('error', error);
     return res.status(500).json({ error: 'error', details: error.message });
    }
 
 })



 //para eliminar carrito
router.delete('/:cid', async (req,res)=>{
    try{
     const cid = req.params.cid
      
     const carrito = await CartModel.findById(cid).exec();
      console.log('1', carrito)                
         carrito.productosagregados = []
         console.log('2',carrito) 
         await carrito.save()
         console.log('3',carrito) 
         return res.json({ msg: 'carrito actualizado!', carrito });
 
    }catch (error){
     console.error('error', error);
     return res.status(500).json({ error: 'error', details: error.message });
    }
 
 })




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
