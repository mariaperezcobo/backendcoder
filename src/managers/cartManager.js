import fs from 'fs'
import __dirname from '../utils.js'

export default class CartManager {

    constructor () {
        this.filename = __dirname + '/files/carts.json'
        this.format = 'utf-8'
        this.loadCarts()
        
}

loadCarts = async () =>{
    if (!fs.existsSync(this.filename)) {
        try {
        const carts = await fs.promises.readFile(this.filename, this.format)
        this.carts = JSON.parse(carts)
        console.log('hay archivos!')
    }catch (error){
        console.error('error', error)
    }
}
}

async getCarts(){
    
    try{
        const carts = await fs.promises.readFile(this.filename, this.format)
        this.carts = JSON.parse(carts)      

        return this.carts
        console.log('hay archivos!')

    }catch (error){
        console.error('error', error)
        
    }
    }

}

