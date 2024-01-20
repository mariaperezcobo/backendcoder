

import FileManager from "./file.manager.js";
import __dirname from '../../utils.js'

export default class Products extends FileManager {

    constructor(filename = __dirname + '/dao/files/products.json') {
        super(filename)
    }

    //getProducts = async () => { return this.get() }

    getProductsPaginate = async () => { return this.get() }
   
    getProductsById = async (id) => {
        try {
            console.log('Obteniendo producto por ID:', id);
            return this.getById(id);

        } catch (error) {
           
            console.error('Error en el método getProductsById:', error);
            throw error;
        }
    };

// getProductsById = async (id) => { 
//     try{
       
//         console.log('Obteniendo producto por ID:', id);
//         return this.getById(id) 
    
//     }catch(error){
//         console.error('Error en el método getProductsById:', error);
    
// }
// }

}


// const productManager = new ProductManager()

// const router = Router()


// //para ver un producto
// router.get('/', async (req,res)=>{
//     // const limit = parseInt(req.query.limit)
//     try{

//         const products = await productManager.getProducts()
//         const limit = parseInt(req.query.limit)
//         if(limit){
//             const product = products.slice (0,limit)
//             res.send(product)
            
//          }else{
//             res.send(products)
           
//             console.log(req.params)
//          }
//         } catch (err){
//             res.send('error')
            
//         }
//     })

//     //para agregar un producto
// router.post('/', async (req, res)=>{
//     try{
//         const products = await productManager.getProducts()
//         const product = req.body

//     if (!product.title || !product.price || !product.stock || !product.description || !product.category || !product.status || !product.code){
//         return res.status(400).json({error: 'faltan datos'})
//     }

//     //ordeno los productos por id
//     products.sort((a,b) => a.id - b.id)

//     //me dijo si existe un product con ese id
//     let idExistente = products[products.length - 1].id + 1
//     while(products.some(p=>p.id === idExistente)){
//         idExistente++
//     }
//     product.id = idExistente
//     // product.id = products.length + 1
    
//     products.push(product)

//     try {
//         await fs.promises.writeFile(__dirname + '/dao/files/products.json', JSON.stringify(products));
//         res.status(201).json({ status: 'success', message: 'Producto creado' });

//         io.emit('actualizarProductos', product)

//     } catch (err) {
//         console.error(err); // Registra el error en la consola para depuración
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }

//     } catch (err) {
//         res.status(500).json({ error: 'Error interno del servidor 2' })
//     }   
//     })

//     router.get('/:id', async (req, res)=>{
//        try{
//         const id = parseInt(req.params.id)
//         const products = await productManager.getProducts()
//         const product = products.find (product => product.id === id)

//         if(product){
//             res.send(product)
//         }else{
//             res.status(404).json({error: 'product not found'})
//         }
        
//        }catch {
//         res.status(404).json({error: 'product not found'})
//        } 
//         }
//     )

   
// //para actualizar un producto
// router.put('/:id', async (req,res)=>{
//     const products = await productManager.getProducts()
//     const id = parseInt(req.params.id)
//     const product = req.body

//     if (!product.title || !product.price || !product.stock || !product.description || !product.code || !product.status || !product.category){
//         return res.status(400).json({error: 'faltan datos'})
//     }

//     const indexProduct = products.findIndex(p => p.id === id)
//     if (indexProduct < 0){
//         return res.status(404).json({error: 'product not found'})
//     } else{
//         product.id=id
//         products[indexProduct] = product
//      try {
//             await fs.promises.writeFile(__dirname + '/dao/files/products.json', JSON.stringify(products));
//             res.status(201).json({ status: 'success', message: 'Producto modificado' });
//         } catch  {
            
//             res.status(500).json({ error: 'Error interno del servidor' });
//         }
//     }
   
//     // res.json ({status:'succes', message: 'product updated'})
// })


// //para eliminar un producto
// router.delete('/:id', async (req, res)=>{
//    try{

//     let products = await productManager.getProducts()
//     const id = parseInt(req.params.id)

//     if (!products.some(p=> p.id == id)){
//         return res.status(404).json({error: 'product not found'})
//     }
//   products = products.filter (p=> p.id !== id)

//   try {
//     await fs.promises.writeFile(__dirname + '/dao/files/products.json', JSON.stringify(products));

//     res.status(201).json({ status: 'success', message: 'Producto eliminado' });
    
//     io.emit('eliminarProducto', products)

// } catch (err) {
    
//     res.status(500).json({ error: 'Error interno del servidor' });
// }

//    } catch{
//     res.status(404).json({error: 'product not found!!'})
//    } 
// })


