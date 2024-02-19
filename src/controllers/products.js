
import {request, response} from 'express'
import mongoose from 'mongoose'
import ProductsModel from '../dao/models/prodmongoose.models.js'
import CartModel from '../dao/models/cartmongoose.model.js'
import {ProductService, CartService} from '../services/index.js'
import ProductInsertDTO from '../DTO/products.dto.js'
import logger from '../logging/logger.js'


export const getProducts =async(req=request,res=response)=>{
    try{
           const user = req.session.user
           const cid = req.session.user.cart;

           logger.debug('user', user);
           logger.debug('cid', cid);

         
            const limit = parseInt(req.query?.limit ?? 10)
            const page = parseInt(req.query?.page ?? 1)
            const query = req.query?.query ?? ''
            const categoria = req.query?.categoria ?? ''
            const stock = req.query?.stock ?? ''
            const precio = req.query?.precio ?? ''
    
            const search = {}
         
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
            
         
            result.query = query
           delete result.docs
         
       
            if (result.productsmongoose ) {
                // Añadir la propiedad 'cid' a cada producto en 'productsmongoose'
                result.productsmongoose.forEach(product => {
                    product.cid = cid;
                    
                })}
        //  console.log('Documentos después de agregar "cid":', result);
            //     //console.log('Documentos con precio:', result.productmongoose.price);
            // } else {
            //     console.log('La propiedad "productsmongoose" no está presente en el resultado');
            // }

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
            logger.error('Error en getProducts:', error);
        res.status(500).send('Error interno del servidor');
        }  
 }
 

 export const  getProductsById =async(req=request,res=response)=>{
    try{
        
        const user = req.session.user
        const {id} = req.params
        logger.debug(`ID: ${id}`);

       
        //const productmongoose = await ProductsModel.findOne({code}).lean().exec()
        const productmongoose = await ProductService.getProductsById(id)

        if (!productmongoose) {
            logger.warn('Producto no encontrado')
            return res.status(404).send('Producto no encontrado');
        }
      
        logger.info(`Producto encontrado: ${productmongoose.title}`)
        // console.log(productmongoose)

        res.render('one',{
            productmongoose,
            user,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })

    }catch (error){
        logger.error(`Error al buscar el producto: ${error.message}`);
        //console.error('Error al buscar el producto:', error);
    res.status(500).send('Error interno del servidor');
        

    }
 }

 export const addProduct =async(req=request,res=response)=>{
    try{
        const user = req.session.user
        const userId = req.session.user._id;

     console.log(user)
     console.log(userId)

        const productNew = req.body
        productNew.owner = userId;
        logger.info(`Nuevo producto: ${productNew}`);
        //console.log(productNew)
        const productmongooseNew = new ProductInsertDTO(productNew)
       
        
       const result = await ProductService.addProduct(productmongooseNew)
       // const result = await ProductsModel.create(productmongooseNew)

       logger.info(`resultado de crear un nuevo producto: ${result}`);
      //console.log('resultado de crear prod', result)
        res.redirect('/productsmongoose')

    }catch (error){
        logger.error(`Error al agregar el producto al carrito: ${error.message}`);
        //console.log(error),
        res.status(500).send('Error interno del servidor al crear productos con mongoose: ' + error.message);
    }
    
 }

 export const deleteProduct =async(req=request,res=response)=>{
    try{
        const {id} = req.params
        //console.log('id para elimnar', id)
        logger.debug(`ID para eliminar: ${id}`);

    //     if(req.session?.user && req.session.user.rol === 'admin') {
    //         // Realiza la eliminación del producto aquí)
    //    // await ProductService.deleteProduct({id: id })
    //     await ProductsModel.deleteOne({_id: id })
    
    //return res.json({status: 'success'})

// Verificar si el usuario tiene permisos de administrador o es propietario del producto
if (req.session?.user) {
    const { user } = req.session;

    if (user.rol === 'admin') {
        // Si es un administrador, eliminar el producto directamente
        await ProductsModel.deleteOne({ _id: id });
        return res.json({ status: 'success' });
    } else if (user.rol === 'premium') {
        // Si es un usuario premium, verificar si es el propietario del producto
        const product = await ProductsModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'El producto no fue encontrado' });
        }
        
        // Verificar si el propietario del producto es el mismo que el usuario actual
        if (product.owner === user._id) {
            // Si es el propietario, eliminar el producto
            await ProductsModel.deleteOne({ _id: id });
            return res.json({ status: 'success' });
        } else {
            // Si no es el propietario, devolver un error de permisos
            return res.status(403).json({ error: 'No tienes permisos para eliminar este producto' });
        }
    }
}

// Si el usuario no está autenticado, devolver un error de permisos
res.status(403).json({ error: 'Debes iniciar sesión para eliminar productos' });

    
}catch (error){
        logger.error(`Error al eliminar el producto del carrito: ${error.message}`);
        res.status(500).json(error)
//console.log(error)
    }
 }

    
 export const addProductInCart =async(req=request,res=response)=>{
       
    try{

        const cid = req.params.cid   
        const pid = req.params.pid

        logger.debug(`CID: ${cid}, PID: ${pid}`);

        let carrito = await CartService.getCartsById(cid) 
  
        
    if(req.session?.user && req.session.user.rol !== 'admin'){
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
         await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });
        //console.log('carrito desp de actualizar',carrito)
    }else{
        logger.warn(`Usuario no autorizado`);
        res.status(403).json({ error: 'No tienes permisos para agregar un producto al carrito este producto' });
    }

    


    }catch (error){
        logger.error(`Error al agregar producto al carrito: ${error.message}`);
        res.status(500).json({error: 'error 3', details: error.message})
       }  
}
 

export const updateProductBase =async(req=request,res=response)=>{
    try{
        const user = req.session.user
        const {id} = req.params
        logger.debug(`ID para actualizar: ${id}`);
        

        const updatedProductData = req.body; 

        const updatedProduct = await ProductService.updateProduct(id, updatedProductData);
        //const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        if (updatedProduct) {
          
            res.redirect('/productsmongoose')
        } else {
            logger.warn(`Error al actualizar el producto: ${error.message}`);
            res.status(404).json({ error: 'Producto no encontrado o no se realizaron modificaciones' });
        }

      ;
    }catch (error){
        logger.error(`Error al actualizar el producto: ${error.message}`);
        //console.error('Error in update product route:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
 }

 export const updateProductForm = async (req=request,res=response)=>{
    const {id} = req.params
   
    const productmongoose = await ProductService.getProductsById(id)

        if (!productmongoose) {
            // Si el producto no se encuentra, puedes manejarlo de alguna manera
            return res.status(404).send('Producto no encontrado');
        }
    
    res.render('update', {
        productmongoose,        
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    }
    )
 }

export const createProduct = (req=request,res=response)=>{
    res.render('create', {
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    }
    )
 }


