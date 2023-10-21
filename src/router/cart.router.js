import { Router } from "express"

let carts = 
[
    {"id":2,
    "title":"Calzas Madrid"},
    
    {"id":2,
    "title":"Calzas Madrid"},
    {"id":3,
    "title":"Calzas Madrid"}
]

const router = Router()

router.get('/', (req,res)=>{
res.send(carts)
console.log(carts)
})

router.get('/:cid', async (req,res)=>{
    try{
        const cid = parseInt(req.params.cid)

        const cartBuscado = carts.find(c => c.id === cid)

        res.send(cartBuscado)

    }catch{
        res.status(404).json({error: 'product not found'})
       }  
})

let cart=[]
router.post('/', (req,res)=>{
    try{
        const cart = req.body

        if(!cart.title || cart.price || cart.stock || cart.description || cart.code || cart.status || cart.code){
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


router.post('/:cid/products/:pid', (req,res)=>{
    try{
        const pid = parseInt(req.params.pid)
        const cid = parseInt(req.params.cid)

        const carritoBuscado = carts.find(c=> c.id === cid)

        if(carritoBuscado){
            const productAgregar = products.find (p=>p.id ===pid)
            if(!productAgregar){
                return res.status(400).send({error: 'datos incorrectos'})
            }
            carritoBuscado.push(productAgregar)
        }
        
       console.log(productAgregar)
       
        res.status(201).send({status: 'succes', message: 'product agregado al carrito'})
        res.send(cart[cid])
    }catch{
        res.status(400).json({error: 'faltan datos'})
    }
})

export default router