import { Router } from "express"
import ProductManager from "../managers/productManager.js"
import CartManager from '../managers/cartManager.js'
import __dirname from "../utils.js"

import fs from 'fs'

const cartManager = new CartManager()
const productManager = new ProductManager()

// let carts = 
// [
//     {
//     "id":1,
//     "products":[
//         { "pid":1,
//         "quantity":1}
//         ]
//     },
//     {
//     "id":2,
//     "products":[
//         { "pid":2,
//         "quantity":1}
//         ]
//     },
//     {
//     "id":3,
//     "products":[
//         { "pid":1,
//         "quantity":1}
//         ]
//     } 
// ]

const router = Router()

router.get('/', async (req,res)=>{
try{
    const carts = await cartManager.getCarts()

    res.send(carts)
}catch (err){
    res.send('error')
}
}
)


router.get('/:cid', async (req,res)=>{
    try{
        const carts = await cartManager.getCarts()

        const cid = parseInt(req.params.cid)

        const cartBuscado = carts.find(c => c.id === cid)
        if(!cartBuscado){
            res.status(404).json({error: 'cart not found'})
        }else{
            res.send(cartBuscado)
        }
        

    }catch{
        res.status(404).json({error: 'cart not found'})
       }  
})

let cart=[]


//crear carrito
router.post('/', async(req,res)=>{
    try{
        const carts = await cartManager.getCarts()

        const id = carts.length + 1
        let pid = 0
        let products =[]
       
        const cart ={"id": id, "productos": products}

        carts.push(cart)

        try {
            await fs.promises.writeFile(__dirname + '/files/carts.json', JSON.stringify(carts));
            res.status(201).json({ status: 'success', message: 'cart creado' });
        } catch (err) {
            console.error(err); // Registra el error en la consola para depuración
            res.status(500).json({ error: 'Error interno del servidor' });
        }
        // res.send(carts)
        // res.status(201).send({status: 'succes', message: 'carrito creado'})
        
    }catch (err){
        res.status(500).json({error: 'error del servicor'})
    }
})

//para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req,res)=>{
    try{
        const products = await productManager.getProducts()
        const carts = await cartManager.getCarts()

        const pid = parseInt(req.params.pid)
        const cid = parseInt(req.params.cid)

        const indexCart = carts.findIndex(c=> c.id === cid)

        if(indexCart<0){
                return res.status(400).json({error: 'carrito no encontrado'})
            }

        const productAgregar = products.find (p=>p.id === pid)
        if(!productAgregar){
            return res.status(400).json({error: 'no se encontro producto!'})
        }
        
        //si no hay productos en el carrito, inicio un array de productos
        // if(!carts[indexCart].products){
        //     carts[indexCart].products = []
        // }
        
        const productoBuscado = carts[indexCart].products.find(p=> p.pid === pid)
        
            
       if (productoBuscado) {
        productoBuscado.quantity ++
       }
         else{
            carts[indexCart].products.push({pid: pid, quantity: 1})
            
        }

        try {
            await fs.promises.writeFile(__dirname + '/files/carts.json', JSON.stringify(carts));
            res.status(201).json({ status: 'success', message: 'prod agregado al carrito' });
        } catch (err) {
            console.error(err); // Registra el error en la consola para depuración
            res.status(500).json({ error: 'Error interno del servidor' });
        }
        // res.send(carts)

    } catch (err) {
        res.status(500).json({error: 'no se puede agregar el producto al carrito'})
       
    }
    
}
)

export default router