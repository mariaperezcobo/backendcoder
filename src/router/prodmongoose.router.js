import {Router} from 'express'

const router = Router()

router.get('/', async (req,res)=>{
    res.render('list', {
        productsmongoose: [],
        style: 'index.css',
        title: 'Fitness Ropa deportiva',
    })
})

router.post('/', async (req,res)=>{
    res.send('cargando productos')
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