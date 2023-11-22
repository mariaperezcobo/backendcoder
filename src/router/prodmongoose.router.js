import {Router} from 'express'
import ProductsModel from '../dao/models/prodmongoose.models.js'



const router = Router()

router.get('/', async (req,res)=>{
    const productsmongoose = await ProductsModel.find().lean().exec()
    // console.log({productsmongoose})

    res.render('list', {
        productsmongoose,
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    })
})

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