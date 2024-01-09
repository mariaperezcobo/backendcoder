import {Router} from 'express'
// import ProductsModel from '../dao/models/prodmongoose.models.js'
// import UserRegisterModel from '../dao/models/userregister.model.js'
// import CartModel from '../dao/models/cartmongoose.model.js'
import { addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct } from '../controllers/products.js'

const router = Router()

function auth(req,res, next){
    if (req.session?.user) return next()
    return res.redirect('/login')
}

router.get('/', auth, getProducts)

router.post('/', addProduct)

router.get('/create', createProduct)

router.get('/:code', getProductsById)

router.delete('/:id', deleteProduct)

router.post('/:cid/product/:pid', addProductInCart)


export default router