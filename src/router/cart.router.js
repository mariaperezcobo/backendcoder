import { Router } from "express"

let carts = [{"id":1,
"title":"Calzas Madrid"}]

let cart = [{"id":3,
"title":"Calzas Madrid"},]

const router = Router()

router.get('/', (req,res)=>{
res.send(carts)
})

router.get('/:cid',(req,res)=>{
    res.send(cart)
})

router.post('/:cid/products/:pid', async (req,res)=>{
    try{
        const productAgregar = req.body
        const pid = parseInt(req.params.pid)
        const cid = parseInt(req.params.cid)

        if (!product.title ){
            // return res.status(400).json({error: 'faltan datos'})
        }
        // productAgregar.id = cart.length + 1
        products.id ===id
        cart.push(productAgregar)
    
        // res.status(201).send({status: 'succes', message: 'product agregado al carrito'})
        res.send(cart)
    }catch{
        // res.status(400).json({error: 'faltan datos'})
    }
})

export default router