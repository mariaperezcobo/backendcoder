import CartModel from "../models/cartmongoose.model.js"

export default class Carts {
    getCarts = async () => { return CartModel.find() }
   
    getCartsById = async cid => { return CartModel.findById(cid).exec() }

        
         
}
