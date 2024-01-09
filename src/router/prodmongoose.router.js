import {Router} from 'express'
import ProductsModel from '../dao/models/prodmongoose.models.js'
import UserRegisterModel from '../dao/models/userregister.model.js'
import CartModel from '../dao/models/cartmongoose.model.js'
import { addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct } from '../controllers/products.js'

const router = Router()

function auth(req,res, next){
    if (req.session?.user) return next()
    return res.redirect('/login')
}

router.get('/', auth, getProducts)


router.post('/', addProduct)

// router.post('/', async (req,res)=>{
//     try{
//         const productmongooseNew = req.body
//         const result = await ProductsModel.create(productmongooseNew)

//         // console.log(result)
//         res.redirect('/productsmongoose')

//     }catch (error){
//         console.log(error),
//         res.send('error al crear productos con mongoose')
//     }
// })

router.get('/create', createProduct)

// router.get('/create', async (req,res)=>{
//     res.render('create', {
//         style: 'index.css',
//         title: 'Fitness Ropa deportiva',
//     }
//     )
// })

router.get('/:code', getProductsById)

router.delete('/:id', deleteProduct)


// router.post('/:id', async (req,res)=>{
    
// })



router.post('/:cid/product/:pid', addProductInCart)


export default router