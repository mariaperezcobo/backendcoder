import fs from 'fs'
import ProductManager from '../managers/productManager.js'
//import {io} from '../../app.js'

class FileManager {
    //constructor(filename = __dirname + '/dao/files/products.json') {
    constructor(filename) {
        this.filename = filename;
        this.format = 'utf-8';
        this.products = [];
        this.loadProducts();
        this.loadUsers();
        this.loadCarts();
    }

    async loadProducts () {
       // if (!fs.existsSync(this.filename)) {
            try {

                if (!fs.existsSync(this.filename)) {
                      // Si el archivo no existe, crea uno vacío
            await fs.promises.writeFile(this.filename, '[]', this.format);
            console.log('Archivo creado:', this.filename);
                
                }
            const products = await fs.promises.readFile(this.filename, this.format)

            try{
                this.products = JSON.parse(products)
                console.log('hay archivos!')
            }catch (parseError) {
 // Si hay un error al analizar el JSON, establece products en un array vacío
 console.error('Error analizando JSON:', parseError);
 this.products = [];
            }
           
        }catch (error){
            console.error('error cargando productos', error)
            throw error;
        }
    }
    

    async loadUsers () {
        // if (!fs.existsSync(this.filename)) {
             try {
 
                 if (!fs.existsSync(this.filename)) {
                       // Si el archivo no existe, crea uno vacío
             await fs.promises.writeFile(this.filename, '[]', this.format);
             console.log('Archivo creado:', this.filename);
                 
                 }
             const users = await fs.promises.readFile(this.filename, this.format)
 
             try{
                 this.users = JSON.parse(users)
                 console.log('hay archivos!')
             }catch (parseError) {
  // Si hay un error al analizar el JSON, establece products en un array vacío
  console.error('Error analizando JSON:', parseError);
  this.users = [];
             }
            
         }catch (error){
             console.error('error cargando productos', error)
             throw error;
         }
     }

     async loadCarts () {
        // if (!fs.existsSync(this.filename)) {
             try {
 
                 if (!fs.existsSync(this.filename)) {
                       // Si el archivo no existe, crea uno vacío
             await fs.promises.writeFile(this.filename, '[]', this.format);
             console.log('Archivo creado:', this.filename);
                 
                 }
             const carts = await fs.promises.readFile(this.filename, this.format)
 
             try{
                 this.carts = JSON.parse(carts)
                 console.log('hay archivos!')
             }catch (parseError) {
  // Si hay un error al analizar el JSON, establece products en un array vacío
  console.error('Error analizando JSON:', parseError);
  this.carts = [];
             }
            
         }catch (error){
             console.error('error cargando productos', error)
             throw error;
         }
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
      
     
     getUserByEmailFile = async (email)=> {
       
        try{
         
             const users = await fs.promises.readFile(this.filename, this.format)
             const parsedUsers = JSON.parse(users)
     
             
             console.log('parsedUsers', parsedUsers)
             const user = parsedUsers.find (user => String(user.email) === String(email))
            
             if (user && user.status) {
                 return user;
             } else {
                 console.log('user not found');
             }
       
         
        }catch (error){
         console.error('error', error)
         throw error;
        } 
      }
         
     getUserByIdFile = async (id)=> {
       
        try{
         
             const users = await fs.promises.readFile(this.filename, this.format)
             const parsedUsers = JSON.parse(users)
     
             
             console.log('parsedUsers', parsedUsers)
             const user = parsedUsers.find (user => String(user.id) === String(id))
            
             if (user && user.status) {
                 return user;
             } else {
                 console.log('user not found');
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

    await this.loadProducts()
    return { status: 'success', message: 'Producto creado' };   

   

    } catch (error) {
        console.error('Error en el método addProduct:', error);
            throw error;
    }   

    }

    addUserFile = async (user) => {
       
        try{
            
        const readUser = await fs.promises.readFile(this.filename, this.format)
        const users = JSON.parse(readUser)
        //const product = req.body

    // if (!product.title || !product.price || !product.stock || !product.description || !product.category || !product.status || !product.code){
    //     return res.status(400).json({error: 'faltan datos'})
    // }

    //ordeno los productos por id
    users.sort((a,b) => a.id - b.id)

    //me dijo si existe un product con ese id
    let idExistente = users[users.length - 1].id + 1
    while(users.some(p=>p.id === idExistente)){
        idExistente++
    }

     // Agrega la propiedad _id al objeto user
    user._id = idExistente;

    user.id = idExistente
    // product.id = products.length + 1
    console.log('id de usuario', user.id)
    users.push(user)
//console.log('usuarios', users)
console.log('usuario', user)
   
    await fs.promises.writeFile(this.filename, JSON.stringify(users));
    // io.emit('actualizarProductos', product)

    await this.loadUsers()
    return user; 

   

    } catch (error) {
        console.error('Error en el método user:', error);
            throw error;
    }   

    }


    addCartFile = async (cart) => {
       
        try{
            const readCart = await fs.promises.readFile(this.filename, this.format);
            let carts;
    
            try {
                // Intenta parsear el contenido del archivo
                carts = JSON.parse(readCart);
            } catch (parseError) {
                // Si hay un error al analizar el JSON, establece carts en un array vacío
                console.error('Error analizando JSON:', parseError);
                carts = [];
            }
       
      //  console.log('carritos desde addcart', carts)
        //const product = req.body

    // if (!product.title || !product.price || !product.stock || !product.description || !product.category || !product.status || !product.code){
    //     return res.status(400).json({error: 'faltan datos'})
    // }
   // Verifica si carts es un array vacío
   if (!Array.isArray(carts)) {
    carts = [];
}
//console.log('carts.lenght', carts.length)
    //ordeno los productos por id
    carts.sort((a,b) => a.id - b.id)

    //me dijo si existe un product con ese id
    let idExistente = carts.length > 0 ? (carts[carts.length - 1].id || 0) + 1 : 1;

  
   console.log('idexistente', idExistente)
    while(carts.some(p=>p.id === idExistente)){
        idExistente++
    }
    //cart.id = idExistente
    // product.id = products.length + 1


    const newCart ={
        id: idExistente,
       productosagregados:[],
    }

    console.log('id de cart', newCart.id)
    carts.push(newCart)
//console.log('carts', carts)
console.log('newcart desde addcart', newCart)
   
    await fs.promises.writeFile(this.filename, JSON.stringify(carts));
    // io.emit('actualizarProductos', product)

    //await this.loadCarts()
    return newCart   

   

    } catch (error) {
        console.error('Error en el método cart:', error);
            throw error;
    }   

    }

    updateCartFile= async (cid, update) =>{try {
    
        const list = await fs.promises.readFile(this.filename, this.format);
        const parsedList = JSON.parse(list);
        const idx = parsedList.findIndex(cart => cart.id === cid);
      
        if (idx === -1) {
            throw new Error('Cart not found');
          }

           // Actualizar el carrito con los nuevos datos
      parsedList[idx] = { ...parsedList[idx], ...update };

        await fs.promises.writeFile(this.filename, JSON.stringify(parsedList))
        return { status: 'success', message: 'Cart updated' };

    } catch (error) {
        console.error('Error en updateCart:', error);
        throw error;
    }}    

    addProductInCart = async ()=>{

    }

    updateUserFile= async (cid, update) =>{try {
    
        const list = await fs.promises.readFile(this.filename, this.format);
        const parsedList = JSON.parse(list);
        const idx = parsedList.findIndex(user => user.id === cid);
      console.log('idx del user', idx)

        if (idx === -1) {
            throw new Error('user not found');
          }

           // Actualizar el carrito con los nuevos datos
      parsedList[idx] = { ...parsedList[idx], ...update };

      try {
        await fs.promises.writeFile(this.filename, JSON.stringify(parsedList));
        console.log('Archivo actualizado correctamente');
        return parsedList[idx];

    } catch (writeError) {
        console.error('Error al escribir en el archivo:', writeError);
        throw writeError;
    }
      
    } catch (error) {
        console.error('Error en updateuser:', error);
        throw error;
    }} 


    update = async (id, data) => {
       
    }

}


export default FileManager
