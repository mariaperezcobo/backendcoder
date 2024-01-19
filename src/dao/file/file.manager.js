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
            this.products = JSON.parse(products)
            
            if (limit){
                const productsFiltrados = this.products.slice(0,limit)
                return productsFiltrados
            }         
    
            return this.products
            console.log('hay archivos!')
    
        }catch (error){
            console.error('error', error)
            
        }
        }
    

    getById = async (req,res)=> {
       
       try{
        const id = req.params.id

        if (!id) {
            // Si no hay un parámetro 'id' en la solicitud, devolver un error 400 Bad Request
            return res.status(400).json({ error: 'Missing parameter: id' });
        }

        console.log('id', id)

        try{
            const products = await fs.promises.readFile(this.filename, this.format)
            this.products = JSON.parse(products)
    
            console.log(products)
            const product = products.find (product => product.id === id)
           
            if(product){
                res.send(product);
                
            }else{
                res.status(404).json({ error: 'product not found' });
            }
        }catch(error){
            console.error('error', error)
            res.status(500).json({ error: 'internal server error' })
        }


        
        
       }catch (error){
        console.error('error', error)
        res.status(500).json({ error: 'internal server error' })
       } 
        }
        
    

    addProduct = async data => {
       

    }

    update = async (id, data) => {
       
    }

}


export default FileManager
