import fs from 'fs'
import ProductManager from '../managers/productManager.js'

class FileManager {
    constructor(filename = __dirname + '/dao/files/products.json') {
        this.filename = filename
    }

    getProducts = async (limit) => {
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
    

    getProductsById = async id => {
       
    //    try{
    //     const id = parseInt(req.params.id)
    //     const products = await fs.promises.readFile(this.filename, this.format)
    //     this.products = JSON.parse(products)
    //     const product = products.find (product => product.id === id)

    //     if(product){
    //         res.send(product)
    //     }else{
    //         res.status(404).json({error: 'product not found'})
    //     }
        
    //    }catch {
    //     res.status(404).json({error: 'product not found'})
    //    } 
        }
        
    

    addProduct = async data => {
       

    }

    update = async (id, data) => {
       
    }

}


export default FileManager
