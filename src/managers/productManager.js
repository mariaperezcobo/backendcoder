
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

// getProductById = async (idProduct)=>{

//     try{
//         const products = await this.getProducts()

//         const validarID = await products.find(product => product.id === idProduct)
//         if (!validarID) {console.log("el producto no existe")}
//          else {
//             console.log('el producto buscado es', {validarID})
            
//          } 
//          return validarID

//     }catch (error){
//         console.error('error', error)
//         return []
 
//     }

// }

// getNextID = () => {
//     const count = this.products.length
//     if (count === 0) return 1
//     const lastProduct = this.products[count-1]
//     return lastProduct.id + 1
// }

// createProduct= async (title, description, price, thumbnail, code, stock) =>{
       
//     const products = await this.getProducts()

//     if (!title || !description || !price || !thumbnail || !code || !stock ) return console.log("Campos incompletos")
    
//     if (this.products.some((product)=> product.code === code)) return console.log ("El producto ya existe")

// const id = this.getNextID()

// const newProduct={
//     id,
//     title,
//     description, 
//     price, 
//     thumbnail, 
//     code, 
//     stock
// }
// this.products.push(newProduct)

// try{
//     await fs.promises.writeFile(this.filename, JSON.stringify(products))
//     console.log('producto creado')
        
// }catch (error){
//     console.error(error)
// }

// try{
//    const products = await fs.promises.readFile(this.filename, this.format)
//     this.products = JSON.parse(products)
// }catch (error){
//     console.error(error)
// }

// } 
}

