import {Router} from 'express'
import ProductManager from '../managers/productManager.js'
import fs from 'fs'
import __dirname from '../utils.js'

const productManager = new ProductManager()

const router = Router()


//para ver un producto
router.get('/', async (req,res)=>{
    // const limit = parseInt(req.query.limit)
    try{

        const products = await productManager.getProducts()
        const limit = parseInt(req.query.limit)
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

    //para agregar un producto
router.post('/', async (req, res)=>{
    try{
        const products = await productManager.getProducts()
        const product = req.body

    if (!product.title || !product.price || !product.stock || !product.description || !product.category || !product.status || !product.code){
        return res.status(400).json({error: 'faltan datos'})
    }
    product.id = products.length + 1
    products.push(product)

    try {
        await fs.promises.writeFile(__dirname + '/files/products.json', JSON.stringify(products));
        res.status(201).json({ status: 'success', message: 'Producto creado' });
    } catch (err) {
        console.error(err); // Registra el error en la consola para depuración
        res.status(500).json({ error: 'Error interno del servidor' });
    }

    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' })
    }   
    })

    router.get('/:id', async (req, res)=>{
       try{
        const id = parseInt(req.params.id)
        const products = await productManager.getProducts()
        const product = products.find (product => product.id === id)

        if(product){
            res.send(product)
        }else{
            res.status(404).json({error: 'product not found'})
        }
        
       }catch {
        res.status(404).json({error: 'product not found'})
       } 
        }
    )

   
//para actualizar un producto
router.put('/:id', async (req,res)=>{
    const products = await productManager.getProducts()
    const id = parseInt(req.params.id)
    const product = req.body

    if (!product.title || !product.price || !product.stock || !product.description || !product.code || !product.status || !product.category){
        return res.status(400).json({error: 'faltan datos'})
    }

    const indexProduct = products.findIndex(p => p.id === id)
    if (indexProduct < 0){
        return res.status(404).json({error: 'product not found'})
    } else{
        product.id=id
        products[indexProduct] = product
     try {
            await fs.promises.writeFile(__dirname + '/files/products.json', JSON.stringify(products));
            res.status(201).json({ status: 'success', message: 'Producto modificado' });
        } catch  {
            
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
   
    // res.json ({status:'succes', message: 'product updated'})
})


//para eliminar un producto
router.delete('/:id', async (req, res)=>{
   try{

    let products = await productManager.getProducts()
    const id = parseInt(req.params.id)

    if (!products.some(p=> p.id == id)){
        return res.status(404).json({error: 'product not found'})
    }
  products = products.filter (p=> p.id !== id)

  try {
    await fs.promises.writeFile(__dirname + '/files/products.json', JSON.stringify(products));

    res.status(201).json({ status: 'success', message: 'Producto eliminado' });
} catch (err) {
    
    res.status(500).json({ error: 'Error interno del servidor' });
}

   } catch{
    res.status(404).json({error: 'product not found!!'})
   } 
})

export default router