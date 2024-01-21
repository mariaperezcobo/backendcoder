import {request, response} from 'express'
import CartModel from "../dao/models/cartmongoose.model.js";
import { CartService } from '../services/index.js';

export const getCartById =async(req=request,res=response)=>{

    try{
        const {cid} = req.params
        const user = req.session.user
       // console.log('cid desde el controller', cid)
        //const carrito = await CartModel.findById(cid).populate('productosagregados.product').lean().exec();

        const carrito = await CartService.getCartsById(cid)
      //console.log('carrito', carrito)

    if(!carrito){
        return res.status(404).json({ error: 'cart not found' });
    }


    // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
    carrito.productosagregados = carrito.productosagregados.map(product => {
        return {
            ...product,
            cid: cid
        };
    });
    // carrito.productosagregados.forEach(product => {
    //     product.cid = cid;
    // });
    console.log ('carrito', carrito)
    //console.log ('carrito.productosagregados', carrito.productosagregados)
       // return res.json({carrito});
    //res.status(400).json('el id del carrito no existe'),
    console.log('usuario desde getprodtoby', user)
    res.render('cartone', {
        carrito,
        user,
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
   

        await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });
        //await carrito.save()
   
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
            
            await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });
            //await carrito.save()
                
            return res.json({ msg: 'carrito actualizado!', carrito });
        
           }catch (error){
            console.error('error', error);
            return res.status(500).json({ error: 'error', details: error.message });
           }
        
        }

export const getCartToBuy =async(req=request,res=response)=>{

             try{
             const {cid} = req.params
             console.log('cid desde el controller', cid)
            //     //const carrito = await CartModel.findById(cid).populate('productosagregados.product').lean().exec();
        
            const carrito = await CartService.getCartsById(cid)
            //   //console.log('carrito', carrito)
        
            if(!carrito){
                return res.status(404).json({ error: 'cart not found' });
            }
        
        
            // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
            carrito.productosagregados = carrito.productosagregados.map(product => {
                return {
                    ...product,
                    cid: cid
                };
            });
            // carrito.productosagregados.forEach(product => {
            //     product.cid = cid;
            // });
            console.log ('carrito de getCartToBuy', carrito)

          //  console.log ('carrito.productosagregados', carrito.productosagregados)
               // return res.json({carrito});
            //res.status(400).json('el id del carrito no existe'),
            
            let stockAlert = ''

             // Verificar y ajustar la cantidad en base al stock disponible
            carrito.productosagregados.forEach(product => {
            const stockDisponible = product.product.stock;

            if (product.quantity > stockDisponible) {
                // Si la cantidad solicitada es mayor que el stock, ajustar la cantidad al stock disponible
                product.quantity = stockDisponible;
              
                // Enviar un mensaje de alerta a la vista
                stockAlert = 'No tenemos suficiente stock para algunos productos, ajustamos la cantidad en el carrito';
                
            }
        });
     // Actualizar el carrito en la base de datos
        await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });

            let totalCompra

            try{
                totalCompra = carrito.productosagregados.reduce((acc, product) => acc + product.product.price * product.quantity, 0)
                console.log('totalcompra',totalCompra)
              
            }catch(error){
                console.error('error en calcular total compra', error)
            }
            

            res.render('purchase', {
                 carrito,
                 totalCompra,
                cid,
                style: 'index.css',
                title: 'Fitness Ropa deportiva',
                stockAlert,
            })
            }catch(error){
                console.log('error', error)
            }
        }





    //     export const seeCarts =async(req=request,res=response)=>{
    //         try{
    //             const carritosmongoose = await CartModel.find().populate('productosagregados.product').lean().exec()
    //            // console.log(carritosmongoose)
            
    //             // const result = await ProductsModel.find().lean().exec()
    //             // result.productsmongoose = result.docs
            
    //             res.render('cartmongoose',{
    //                 carritosmongoose,
    //                 style: 'index.css',
    //                 title: 'Fitness Ropa deportiva',
    //             })
               
    //         }catch (error){
    //             console.error('error',error)
        
    //         }
    //  }

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
