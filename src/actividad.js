// import express from 'express'

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

// let frase = 'hola mundo, este es el curso de backed'

// app.get('/api/frase', (req, res)=> res.send({frase}))

// app.get('/api/frase/:pos', (req, res)=>{
//     const words = frase.split(' ')
//     const pos = parseInt(req.params.pos)-1
    

//     if (!words[pos]){
//         return res.status(404).send('palabra not found')
//     }
//     res.send(words[pos])
// })

// app.post('/api/palabras', (req, res)=>{
//     const palabra = req.body.palabra

//     const position = frase.split(' ').length +1
//     frase = frase + ' '+ palabra

//     res.json({
//         agregada: palabra,
//         pos: position
//     })
    
// })



// app.listen(8080, ()=>console.log('corriendo..'))