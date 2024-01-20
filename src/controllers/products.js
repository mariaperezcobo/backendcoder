
import {request, response} from 'express'
import mongoose from 'mongoose'
import ProductsModel from '../dao/models/prodmongoose.models.js'
import CartModel from '../dao/models/cartmongoose.model.js'
import {ProductService, CartService} from '../services/index.js'


export const getProducts =async(req=request,res=response)=>{
    try{
       // console.log('ProductsModel:', ProductsModel); 
     //   console.log('CartsModel:', CartModel); 
        //     const carrito = await CartModel.findOne({}) 
        //     console.log(carrito)
            // let cid
           
            // if(carrito){
            //     cid = carrito.id
            // }else{
            //     carrito = await CartModel.create({ productosagregados: [] })
            //     cid = carrito.id
            // }
    
              // const usuario = await UserRegisterModel.find()
           const user = req.session.user
           const cid = req.session.user.cart;

           console.log('user', user)
           console.log('cid', cid)
    
            const limit = parseInt(req.query?.limit ?? 10)
            const page = parseInt(req.query?.page ?? 1)
            const query = req.query?.query ?? ''
            const categoria = req.query?.categoria ?? ''
            const stock = req.query?.stock ?? ''
            const precio = req.query?.precio ?? ''
    
            const search = {}
            // const filtro = {}
            if (query) search.title = {"$regex": query, "$options": "i"}
            
            if (categoria && categoria !== 'todos') {
                search.category = { "$regex": categoria, "$options": "i" };
            }
    
            if (stock && stock !== 'todos') {
                search.stock = {'$gt': 1}
            }
    
            let sortDirection = 1
            if (precio === 'menor') {
                sortDirection = 1
            } if (precio === 'mayor'){
                sortDirection = -1}
                else{
                sortDirection = 1
            }
    
    
            const searchQuery = { ...search };
            // const result = await ProductsModel.paginate(searchQuery,{
            //     page,
            //     limit,
            //     lean:true,
            //     sort: {price: sortDirection}
            // })
            // const result = await ProductService.getProductsPaginate(searchQuery,{
            //     page,
            //     limit,
            //     lean:true,
            //     sort: {price: sortDirection}
            // })

            const options = {
                page,
                limit,
                lean:true,
                sort: {price: sortDirection}

            }

        //    console.log('ProductService:', ProductService);
 const result = await ProductService.getProductsPaginate(searchQuery,options)
 
  //const result = await ProductsModel.paginate(searchQuery,options)
      
            
            result.query = query;

            result.productsmongoose = result.docs
            
            //console.log('result', result)
            result.query = query
           delete result.docs
         
         //   console.log('result 2 ', result)
//console.log('cid', cid)

// if (cid) {
//     result.productsmongoose = result.productsmongoose.map(product => ({
//         ...product.toObject(), 
//         cid: cid
//     }));
// }
            if (result.productsmongoose ) {
                // Añadir la propiedad 'cid' a cada producto en 'productsmongoose'
                result.productsmongoose.forEach(product => {
                    product.cid = cid;
                    
                })}
            //     //console.log('Documentos después de agregar "cid":', result);
            //     //console.log('Documentos con precio:', result.productmongoose.price);
            // } else {
            //     console.log('La propiedad "productsmongoose" no está presente en el resultado');
            // }

        

//console.log(cid)
//console.log(result)

//console.log('result4', result.productsmongoose)
//Renderizar la vista
res.render('list', {
    user,
    //dataToSend,
    result ,
    cid,
    style: 'index.css',
    title: 'Fitness Ropa deportiva',
});



        }catch(error){
            console.error('error', error)
            console.error(error)
        }  
 }
 

 export const  getProductsById =async(req=request,res=response)=>{
    try{
        const {id} = req.params
        //const productmongoose = await ProductsModel.findOne({code}).lean().exec()
        const productmongoose = await ProductService.getProductsById(id)
        
        if (!productmongoose) {
            // Si el producto no se encuentra, puedes manejarlo de alguna manera
            return res.status(404).send('Producto no encontrado');
        }
       // console.log(productmongoose)

        res.render('one',{
            productmongoose,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })

    }catch (error){
        console.error('Error al buscar el producto:', error);
    res.status(500).send('Error interno del servidor');
        

    }
 }

 export const addProduct =async(req=request,res=response)=>{
    try{
        const productmongooseNew = req.body
        const result = await ProductService.addProduct(productmongooseNew)

        console.log(result)
        res.redirect('/productsmongoose')

    }catch (error){
        console.log(error),
        res.send('error al crear productos con mongoose')
    }
 }

 export const deleteProduct =async(req=request,res=response)=>{
    try{
        const {id} = req.params
        await ProductService.deleteProduct(id)

        return res.json({status: 'success'})
    }catch (error){
        res.status(500).json(error)
console.log(error)
    }
 }

 export const addProductInCart =async(req=request,res=response)=>{
       
    try{

        const cid = req.params.cid   
        const pid = req.params.pid
        
        let carrito = await CartService.getCartsById(cid) 
    //  console.log('carrito', carrito)
    // console.log('param', cid, pid)
    //  console.log('carrito con prod', carrito.productosagregados)
               
        const productoInCart = carrito.productosagregados.find(p => p.product && p.product._id.toString() === pid);
    //    console.log('productoincart',productoInCart)
        if (productoInCart){
            productoInCart.quantity++;
        }
        
    else{
        const newProduct = { product: pid, quantity: 1}
        carrito.productosagregados.push(newProduct);
    }
      
    // Actualizar la base de datos con los cambios
   // await CartModel.findByIdAndUpdate(cid, { productosagregados: carrito.productosagregados }, { new: true });
    //await CartService.updateCart(cid, { productosagregados: carrito.productosagregados }, { new: true });
     await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });
    //console.log('carrito desp de actualizar',carrito)


    }catch (error){
        console.error('error al agregar un prod', error)
        res.status(500).json({error: 'error 3', details: error.message})
       }  
}
 

export const createProduct = (req=request,res=response)=>{
    res.render('create', {
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    }
    )
 }
// import {request, response} from 'express'
// import ProductsModel from '../dao/models/prodmongoose.models.js'
// import CartModel from '../dao/models/cartmongoose.model.js'

//  export const getProducts =async(req=request,res=response)=>{
//     try{
//         //     const carrito = await CartModel.findOne({}) 
//         //     console.log(carrito)
//             // let cid
           
//             // if(carrito){
//             //     cid = carrito.id
//             // }else{
//             //     carrito = await CartModel.create({ productosagregados: [] })
//             //     cid = carrito.id
//             // }
    
//               // const usuario = await UserRegisterModel.find()
//            const user = req.session.user
//            const cid = req.session.user.cart;
    
//             const limit = parseInt(req.query?.limit ?? 10)
//             const page = parseInt(req.query?.page ?? 1)
//             const query = req.query?.query ?? ''
//             const categoria = req.query?.categoria ?? ''
//             const stock = req.query?.stock ?? ''
//             const precio = req.query?.precio ?? ''
    
//             const search = {}
//             // const filtro = {}
//             if (query) search.title = {"$regex": query, "$options": "i"}
            
//             if (categoria && categoria !== 'todos') {
//                 search.category = { "$regex": categoria, "$options": "i" };
//             }
    
//             if (stock && stock !== 'todos') {
//                 search.stock = {'$gt': 1}
//             }
    
//             let sortDirection = 1
//             if (precio === 'menor') {
//                 sortDirection = 1
//             } if (precio === 'mayor'){
//                 sortDirection = -1}
//                 else{
//                 sortDirection = 1
//             }
    
    
//             const searchQuery = { ...search };
    
//             const result = await ProductsModel.paginate(searchQuery,{
//                 page,
//                 limit,
//                 lean:true,
//                 sort: {price: sortDirection}
//             })
            
//            // console.log(result.docs)
//             //console.log(productsmongoose)
    
//             result.productsmongoose = result.docs
//             result.query = query
//             delete result.docs
            
//             result.productsmongoose.forEach(product => {
//                 product.cid = cid;
//             });
            
//            //console.log(result)
//            //console.log(result)
            
//             res.render('list', {
//                 user,
//                 result,
               
//                 cid,
//                 style: 'index.css',
//                 title: 'Fitness Ropa deportiva',
//             })
    
//         }catch(error){
//             console.error('error', error)
//             console.error(error)
//         }  
//  }
 

//  export const getProductsById =async(req=request,res=response)=>{
//     try{
//         const {code} = req.params
//         const productmongoose = await ProductsModel.findOne({code}).lean().exec()

//         res.render('one',{
//             productmongoose,
//             style: 'index.css',
//             title: 'Fitness Ropa deportiva',
//         })
//     }catch (error){
//         res.send('error al buscar el producto')

//     }
//  }

//  export const addProduct =async(req=request,res=response)=>{
//     try{
//         const productmongooseNew = req.body
//         const result = await ProductsModel.create(productmongooseNew)

//         // console.log(result)
//         res.redirect('/productsmongoose')

//     }catch (error){
//         console.log(error),
//         res.send('error al crear productos con mongoose')
//     }
//  }

//  export const deleteProduct =async(req=request,res=response)=>{
//     try{
//         const {id} = req.params
//         await ProductsModel.deleteOne({ _id: id})

//         return res.json({status: 'success'})
//     }catch (error){
//         res.status(500).json(error)
// console.log(error)
//     }
//  }

//  export const addProductInCart =async(req=request,res=response)=>{
       
//     try{

//         const cid = req.params.cid   
//         const pid = req.params.pid
        
//         const carrito = await CartModel.findById(cid) 

//          console.log('param', cid, pid)

               
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

//         //return res.json({ msg: 'Carrito actualizado!', carrito });

//     }catch (error){
//         console.error('error al agregar un prod', error)
//         res.status(500).json({error: 'error 3', details: error.message})
//        }  
// }
 

// export const createProduct = (req=request,res=response)=>{
//     res.render('create', {
//         style: 'index.css',
//         title: 'Fitness Ropa deportiva',
//     }
//     )
//  }