import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

let products = [
    {id: 1, name:"beers", price: 100, stock: 29},
    {id: 2, name:"wines", price: 150, stock: 13},
    {id: 3, name:"banana", price: 200, stock: 10}
]

app.get ('/', (req, res)=> res.send('ok'))

app.get('/api/products', (req,res)=> res.json(products))

app.get('/api/products/:id', (req, res)=>{
    const id = parseInt(req.params.id)

    const product = products.find (product => product.id === id)

    if (!product){
        return res.status(404).json({error: 'product not found'})
    }
    res.json(product)

})

app.post('/api/products', (req, res)=>{
    const product = req.body

    if (!product.name || !product.price || !product.stock){
        return res.status(400).json({error: 'faltan datos'})
    }
    product.id = products.length + 1

    products.push(product)
    res.status(201).send({status: 'succes', message: 'product created'})

})

app.put('/api/products/:id', (req,res)=>{
    const id = parseInt(req.params.id)
    const product = req.body

    if (!product.name || !product.price || !product.stock){
        return res.status(400).json({error: 'faltan datos'})
    }

    const indexProduct = products.findIndex(p => p.id === id)
    if (indexProduct < 0){
        return res.status(404).json({error: 'product not found'})
    }
    products[indexProduct] = product
    res.json ({status:'succes', message: 'product updated'})
})

app.delete('/api/products/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    if (!products.some(p=> p.id == id)){
        return res.status(404).json({error: 'product not found'})
    }
  products = products.filter (p=> p.id !== id)

  res.send({status:'succes', message:'product deleted'})
})


app.listen (8080, ()=> console.log('running..'))
