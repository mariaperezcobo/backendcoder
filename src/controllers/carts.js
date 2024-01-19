import {request, response} from 'express'
import CartModel from "../dao/models/cartmongoose.model.js";
import { CartService } from '../services/index.js';

export const getCartById =async(req=request,res=response)=>{

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

export const deleteProductInCart =async(req=request,res=response)=>{
    try{
        const cid = req.params.cid
        const pid = req.params.pid
    
        const carrito = await CartService.getCartsById(cid)
    
        //console.log(cid)

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
    
    }

    export const deleteAllProductsInCart =async(req=request,res=response)=>{
        try{
            const cid = req.params.cid
             
            const carrito =  await CartService.getCartsById(cid);
                        
                carrito.productosagregados = []
              
                await carrito.save()
                
                return res.json({ msg: 'carrito actualizado!', carrito });
        
           }catch (error){
            console.error('error', error);
            return res.status(500).json({ error: 'error', details: error.message });
           }
        
        }
    

        export const seeCarts =async(req=request,res=response)=>{
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
     }

     export const createCart =async(req=request,res=response)=>{
        try{
            const carritoNew = req.body
            const resultcarrito = await CartService.addCart(carritoNew)
            res.redirect('/cartmongoose')
        }catch(error){
            console.log(error),
            res.send('error al crear el carrito')
        }
    }
