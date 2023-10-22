import { Router } from "express"
import ProductManager from "../managers/productManager.js"

const productManager = new ProductManager()

let carts = 
[
    {
    "id":1,
    "products":[
        { "pid":1,
        "quantity":1}
        ]
    },
    {
    "id":2,
    "products":[
        { "pid":2,
        "quantity":1}
        ]
    },
    {
    "id":3,
    "products":[
        { "pid":1,
        "quantity":1}
        ]
    } 
]

const router = Router()

router.get('/', (req,res)=>{
res.send(carts)

})

router.get('/:cid', async (req,res)=>{
    try{
        const cid = parseInt(req.params.cid)

        const cartBuscado = carts.find(c => c.id = cid)

        res.send(cartBuscado)

    }catch{
        res.status(404).json({error: 'product not found'})
       }  
})

let cart=[]


//crear carrito
router.post('/', (req,res)=>{
    try{
        const id = carts.length + 1
        let pid = 0
        let products =[]
       
        const cart ={"id": id, "productos": products}
       
      

        carts.push(cart)
        res.send(carts)
        // res.status(201).send({status: 'succes', message: 'carrito creado'})
        
    }catch (err){
        res.status(500).json({error: 'error del servicor'})
    }
})

//para agregar un producto al carrito
router.post('/:cid/products/:pid', async (req,res)=>{
    try{
        const products = await productManager.getProducts()

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
        res.send(carts)

    } catch (err) {
        res.status(500).json({error: 'no se puede agregar el producto al carrito'})
        console.error(err);
    }
    
}
)

export default router