
import fs from 'fs'


export default class ProductManager {

    constructor () {
        this.filename = './files/products.json'
        this.format = 'utf-8'
        this.loadProducts()
        
}

loadProducts = async () =>{
    if (!fs.existsSync(this.filename)) {
        try {
        const products = await fs.promises.readFile(this.filename, this.format)
        this.products = JSON.parse(products)
        console.log('hay archivos!')
    }catch (error){
        console.error('error', error)
    }
}
}

async getProducts(limit){
    
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

}

