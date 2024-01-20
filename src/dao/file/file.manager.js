import fs from 'fs'
import ProductManager from '../managers/productManager.js'

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
        
        // getById = async (req,res)=> {
       
        //     try{
        //      console.log('Leyendo datos del archivo por id...');
        //      console.log('Params:', req.params);
        //      const id = req.params.id
        //      console.log('id', id)
        //      console.log('Leyendo datos del archivo por id...', id);
     
        //       if (!id) {
        //           // Si no hay un parámetro 'id' en la solicitud, devolver un error 400 Bad Request
        //           return res.status(400).json({ error: 'Missing parameter: id' });
        //       }
     
        //      // console.log('id', id)
     
             
        //          const products = await fs.promises.readFile(this.filename, this.format)
        //          const parsedProducts = JSON.parse(products)
         
                 
        //          console.log('parsedProducts', parsedProducts)
        //          const product = parsedProducts.find (product => String(product.id) === String(id))
                
        //          if(product){
        //              return product
                     
        //          }else{
        //              res.status(404).json({ error: 'product not found' });
        //          }
           
     
             
        //     }catch (error){
        //      console.error('error', error)
        //      res.status(500).json({ error: 'internal server error' })
        //     } 
        //      }
             

    addProduct = async data => {
       

    }

    update = async (id, data) => {
       
    }

}


export default FileManager
