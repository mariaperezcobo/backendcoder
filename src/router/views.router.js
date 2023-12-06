import { Router } from "express"
import ProductManager from '../dao/managers/productManager.js'


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

// router.get ('/', (req, res)=> {
//     const user={
//         name: 'maria',
//         isAdmin: true
//     }
    
//     res.render('index',{
//         user,
//         title: 'Fitness Ropa deportiva',
//         style: 'index.css',
//         foods
//     })
// })

//middlewares para sesiones
function justPublicWhitoutSession (req,res,next){
    if(req.session?.user) return res.redirect('/profile')
    return next()
}

function auth(req,res, next){
    if (req.session?.user) return next()
    return res.redirect('/login')
}

//renders para sesiones

router.get('/', auth, (req,res)=> {
    const user = req.session.user

   return  res.render('index',{
    user,
    style: 'index.css',
    title: 'Fitness Ropa deportiva',
   })
})

router.get('/login', justPublicWhitoutSession, (req,res) =>{
    return res.render('login', {
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    })
})

router.get('/registeruser', justPublicWhitoutSession ,(req,res)=>{
    return res.render('registeruser',{
        
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    })
})

router.get('/profile', auth, (req, res) =>{
    const user = req.session.user

    res.render('profile',
        {
            user,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        } 
)
})


// router.get('/register', (req, res)=>{
//     res.render('register',{
//         style: 'index.css',
//     })
// })


const messages=[]
router.get('/chat', (req, res)=>{
    res.render('chat',{
        style: 'index.css',
       messages
        
    })
})




export default router