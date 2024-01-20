import CartModel from "../models/cartmongoose.model.js"

export default class Carts {
    getCarts = async () => { return CartModel.find() }
   
    getCartsById = async cid => { 

        try{
            const carrito = await CartModel.findById(cid).populate('productosagregados.product').lean().exec(); 

            console.log('Carrito obtenido:', carrito)
            console.log('cid desde el dao', cid)
            return carrito
        }catch(error){
            console.error('Error en getCartsById:', error);
            throw error;
        }
        
        
    }

    //getCartsById = async cid => { return CartModel.findById(cid).exec() }

    addCart = async cart => { return CartModel.create(cart) }
         
}
