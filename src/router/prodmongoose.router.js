import {Router} from 'express'
//import { addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct } from '../controllers/products.js'
import { addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct, updateProductBase, updateProductForm } from '../controllers/products.js'
import {isAdmin, isAdminEliminate, isUser} from "../controllers/sessions.js"
//import {addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct} from "../dao/mongo/products.mongo.js"
//import {addProduct, addProductInCart, deleteProduct, getProducts, getProductsById, createProduct} from "../dao/file/products.file.js"

const router = Router()

function auth(req,res, next){
    if (req.session?.user) return next()
    return res.redirect('/login')
}

router.get('/', auth, getProducts)

router.post('/', addProduct)

router.get('/create',isAdmin, createProduct)

//router.get('/:code', getProductsById)
router.get('/:id', getProductsById)

router.delete('/:id',isAdminEliminate, deleteProduct)

router.post('/:cid/product/:pid',isUser, addProductInCart)

 router.get('/:id/update',isAdmin, updateProductForm)

router.post('/:id/update',isAdmin, updateProductBase)
export default router