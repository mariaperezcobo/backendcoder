import {Router} from 'express'
import ProductsModel from '../dao/models/prodmongoose.models.js'
import UserRegisterModel from '../dao/models/userregister.model.js'

const router = Router()

function auth(req,res, next){
    if (req.session?.usuario) return next()
    return res.redirect('/login')
}


router.get('/', auth, async (req,res)=>{
    try{
       // const usuario = await UserRegisterModel.find()
       const usuario = req.session.usuario

        const limit = parseInt(req.query?.limit ?? 10)
        const page = parseInt(req.query?.page ?? 1)
        const query = req.query?.query ?? ''
        const categoria = req.query?.categoria ?? ''
        const stock = req.query?.stock ?? ''
        const precio = req.query?.precio ?? ''

        const search = {}
        // const filtro = {}
        if (query) search.title = {"$regex": query, "$options": "i"}
        
        if (categoria && categoria !== 'todos') {
            search.category = { "$regex": categoria, "$options": "i" };
        }

        if (stock && stock !== 'todos') {
            search.stock = {'$gt': 1}
        }

        let sortDirection = 1
        if (precio === 'menor') {
            sortDirection = 1
        } if (precio === 'mayor'){
            sortDirection = -1}
            else{
            sortDirection = 1
        }


        const searchQuery = { ...search };

        const result = await ProductsModel.paginate(searchQuery,{
            page,
            limit,
            lean:true,
            sort: {price: sortDirection}
        })
        
       // console.log(result.docs)
        //console.log(productsmongoose)

        result.productsmongoose = result.docs
        result.query = query
        delete result.docs
        
       
       //console.log(result)
        
        res.render('list', {
            usuario,
            result,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })

    }catch(error){
        console.error('error', error)
        console.error(error)
    }
  
})

// router.get('/', async (req,res)=>{
//     const productsmongoose = await ProductsModel.find().lean().exec()
//     // console.log({productsmongoose})

//     res.render('list', {
//         productsmongoose,
//         style: 'index.css',
//         title: 'Fitness Ropa deportiva',
//     })
// })


router.post('/', async (req,res)=>{
    try{
        const productmongooseNew = req.body
        const result = await ProductsModel.create(productmongooseNew)

        // console.log(result)
        res.redirect('/productsmongoose')

    }catch (error){
        console.log(error),
        res.send('error al crear productos con mongoose')
    }
})
router.get('/create', async (req,res)=>{
    res.render('create', {
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    }
    )
})
router.get('/:code', async (req,res)=>{
    try{
        const {code} = req.params
        const productmongoose = await ProductsModel.findOne({code}).lean().exec()

        res.render('one',{
            productmongoose,
            style: 'index.css',
            title: 'Fitness Ropa deportiva',
        })
    }catch (error){
        res.send('error al buscar el producto')

    }
 })

router.delete('/:id', async (req,res)=>{
    try{
        const {id} = req.params
        await ProductsModel.deleteOne({ _id: id})

        return res.json({status: 'success'})
    }catch (error){
        res.status(500).json(error)
console.log(error)
    }
    
})

// router.post('/:id', async (req,res)=>{
    
// })




export default router