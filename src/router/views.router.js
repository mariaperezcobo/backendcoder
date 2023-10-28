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
            products
            
         })
    })

   

router.get ('/', (req, res)=> {
    const user={
        name: 'maria',
        isAdmin: true
    }
    
    res.render('index',{
        user,
        title: 'my page',
        style: 'index.css',
        foods
    })
})

router.get('/register', (req, res)=>{
    res.render('register',{})
})


export default router