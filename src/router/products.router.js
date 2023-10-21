import {Router} from 'express'
import ProductManager from '../managers/productManager.js'

const productManager = new ProductManager()

const router = Router()

let products = [
    {"id":1,
    "title":"Calzas Lisboa",
    "description":"Calzas estampadas",
    "price":20000,
    "thumbnail":".img.jpg",
    "category": "calzas",
    "status": true,
    "code":61,
    "stock":29},

    {"id":2,
    "title":"Calzas Londres",
    "description":"Calzas grises",
    "price":28000,
    "thumbnail":".img.jpg",
    "code":2,
    "category": "calzas",
    "status": true,
    "stock":15},

    {"id":3,
    "title":"Calzas Madrid",
    "description":"Calzas estampadas blancas y azules",
    "price":16000,
    "thumbnail":".img.jpg",
    "code":52,
    "category": "calzas",
    "status": true,
    "stock":22},
]

router.get('/', (req,res)=> res.json(products))

router.get('/', async (req,res)=>{
    const limit = parseInt(req.query.limit)
    
    try{
        if(limit){
            const product = products.slice (0,limit)
            res.json(product)
         }else{
            res.send(products)
            console.log(req.params)
         }
        } catch (err){
            res.send('error')
        }
    })

router.post('/',  (req, res)=>{
    try{
        const product = req.body

    if (!product.title || !product.price || !product.stock || !product.description || !product.code || !product.status || !product.code){
        return res.status(400).json({error: 'faltan datos'})
    }
    product.id = products.length + 1
    products.push(product)

    res.status(201).send({status: 'succes', message: 'product created'})
    res.send(products)

    } catch (err){
        res.send('error')
    }   
    })

    router.get('/:id', async (req, res)=>{
       try{
        const id = parseInt(req.params.id)
    
        const product = products.find (product => product.id === id)
        // res.json(product)
        res.send(product)
       }catch{
        res.status(404).json({error: 'product not found'})
       } 
        }
        
    )

   

router.put('/:id', (req,res)=>{
    const id = parseInt(req.params.id)
    const product = req.body

    if (!product.title || !product.price || !product.stock || !product.description || !product.code || !product.status || !product.code){
        return res.status(400).json({error: 'faltan datos'})
    }

    const indexProduct = products.findIndex(p => p.id === id)
    if (indexProduct < 0){
        return res.status(404).json({error: 'product not found'})
    } else{
        product.id===id
        products[indexProduct] = product
    }
   
    
    // products.id == id
    res.json ({status:'succes', message: 'product updated'})
})



router.delete('/:id', async (req, res)=>{
   try{
    const id = parseInt(req.params.id)
    if (!products.some(p=> p.id == id)){
        return res.status(404).json({error: 'product not found'})
    }
  products = products.filter (p=> p.id !== id)

  res.send({status:'succes', message:'product deleted'})
   } catch{
    res.status(404).json({error: 'product not found'})
   } 
})

export default router