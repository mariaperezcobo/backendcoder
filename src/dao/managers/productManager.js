
import fs from 'fs'
import __dirname from '../../utils.js'

export default class ProductManager {

    constructor () {
        this.filename = __dirname + '/dao/files/products.json'
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

// //array de productos de bak up
// [{"id":1, "title":"Calzas Lisboa", "description":"Calzas estampadas","price":20000, "thumbnail":"/static/imagenes/calzas2.png","category":"calzas","code":61,"status":true,"stock":29},
// {"id":2,"title":"Calzas Londres","description":"Calzas grises","price":28000,"thumbnail":"/static/imagenes/calzas3.png","category":"calzas","code":2,"status":true,"stock":15},
// {"id":3,"title":"Calzas Madrid","description":"Calzas estampadas blancas y azules","price":16000,"thumbnail":"/static/imagenes/mujer estir.png","category":"calzas","code":52,"status":true,"stock":22},
// {"title":"Calzas Amsterdam","description":"Calzas estampadas","price":20000,"thumbnail":"/static/imagenes/yoga3.png","category":"calzas","code":61,"status":true,"stock":17,"id":4},
// {"id":5,"title":"Remera Buzios","description":"Remera rosa","price":16000,"thumbnail":"/static/imagenes/remera3.png","category":"remeras","code":53,"stock":22},
// {"title":"Remera Miami","description":"Remera verde","price":20000,"thumbnail":"/static/imagenes/conperro.png","category":"calzas","code":61,"status":true,"stock":2,"id":6}]