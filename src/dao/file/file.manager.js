import fs from 'fs'
import ProductManager from '../managers/productManager.js'
//import {io} from '../../app.js'

class FileManager {
    constructor(filename = __dirname + '/dao/files/products.json') {
        this.filename = filename;
        this.format = 'utf-8';
    }

    get= async (limit) => {
        try{
            const products = await fs.promises.readFile(this.filename, this.format)
            const parsedProducts = JSON.parse(products)
            
            let result = {};

            if (limit){
                // const productsFiltrados = this.products.slice(0,limit)
                // return productsFiltrados
                result.docs = parsedProducts.slice(0, limit);
            } else {
                result.docs = parsedProducts;
            }
           
            return result
    
        }catch (error){
            console.error('error', error)
        }
        }
    

    getById = async (id)=> {
       
       try{
        
            const products = await fs.promises.readFile(this.filename, this.format)
            const parsedProducts = JSON.parse(products)
    
            
            console.log('parsedProducts', parsedProducts)
            const product = parsedProducts.find (product => String(product.id) === String(id))
           
            if (product && product.status) {
                return product;
            } else {
                throw new Error('Product not found');
            }
      
        
       }catch (error){
        console.error('error', error)
        throw error;
       } 
     }
        

    add = async (product) => {
       
        try{
        const readProducts = await fs.promises.readFile(this.filename, this.format)
        const products = JSON.parse(readProducts)
        //const product = req.body

    // if (!product.title || !product.price || !product.stock || !product.description || !product.category || !product.status || !product.code){
    //     return res.status(400).json({error: 'faltan datos'})
    // }

    //ordeno los productos por id
    products.sort((a,b) => a.id - b.id)

    //me dijo si existe un product con ese id
    let idExistente = products[products.length - 1].id + 1
    while(products.some(p=>p.id === idExistente)){
        idExistente++
    }
    product.id = idExistente
    // product.id = products.length + 1
    
    products.push(product)

   
    await fs.promises.writeFile(this.filename, JSON.stringify(products));
    // io.emit('actualizarProductos', product)

    return { status: 'success', message: 'Producto creado' };   

   

    } catch (error) {
        console.error('Error en el método addProduct:', error);
            throw error;
    }   

    }

    


    update = async (id, data) => {
       
    }

}


export default FileManager
