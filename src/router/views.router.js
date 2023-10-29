import { Router } from "express"
import ProductManager from '../managers/productManager.js'


const router = Router()

const foods = [
    {name:'prod a', price:10},
    {name:'prod b', price:10},
    {name:'prod a', price:10},
    {name:'prod a', price:10},
]

const productManager = new ProductManager()
router.get('/home', async (req,res)=>{
    
    
        const products = await productManager.getProducts()
      
     res.render('home',{
            products,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
            
         })
    })

    router.get('/realtimeproducts', async (req, res)=>{
        const products = await productManager.getProducts()
        res.render('realtimeproducts',{
            products,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })
    })

router.get ('/', (req, res)=> {
    const user={
        name: 'maria',
        isAdmin: true
    }
    
    res.render('index',{
        user,
        title: 'Fitness Ropa deportiva',
        style: 'index.css',
        foods
    })
})

router.get('/register', (req, res)=>{
    res.render('register',{})
})




export default router