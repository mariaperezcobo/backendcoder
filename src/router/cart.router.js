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
console.log(carts)
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
        const cart = req.body

        if(!cart.title || cart.price || cart.stock || cart.description || cart.code || cart.status || cart.code || cart.id ){
            return res.status(400).send({error: 'datos incorrectos'})
        }
        cart.id = carts.length + 1
        carts.push(cart)
        res.send(carts)
        // res.status(201).send({status: 'succes', message: 'carrito creado'})
        

    }catch{
        res.status(400).send({error: 'faltan datos'})
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
        
        if(!carts[indexCart].products){
            carts[indexCart].products = []
        }
        
        const productoBuscado = carts[indexCart].products.find(p=> p.pid === pid)
        
            
       if (productoBuscado) {
        productoBuscado.quantity ++
       }
         else{
            carts[indexCart].products.push({pid: pid, quantity: 1})
            
        }
        res.send(carts)

    } catch (err) {
        res.status(400).json({error: 'no se puede agregar el producto al carrito'})
        console.error(err);
    }
    
}
)

export default router