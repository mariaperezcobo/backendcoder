import { Router } from "express"

const router = Router()

const foods = [
    {name:'prod a', price:10},
    {name:'prod b', price:10},
    {name:'prod a', price:10},
    {name:'prod a', price:10},
]

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