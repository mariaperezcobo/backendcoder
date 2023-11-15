import {Router} from 'express'
import ProductsModel from '../models/prodmongoose.models.js'


const router = Router()

router.get('/', async (req,res)=>{
    const productsmongoose = await ProductsModel.find().lean().exec()
    console.log({productsmongoose})

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

        console.log(result)
        res.redirect('/productsmongoose')

    }catch (error){
        console.log(error),
        res.send('error al crear productos con mongoose')
    }
})

// router.get('/:name', async (req,res)=>{
//     res.render('one',)
// })

// router.delete('/:id', (req,res)=>{
//     res.send('borrando producto')
// })


router.get('/create', async (req,res)=>{
    res.render('create', {
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    }
    )
})

export default router