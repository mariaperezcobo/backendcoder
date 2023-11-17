import mongoose from 'mongoose'

// const cartCollection = 'cartmongoose'

const cartSchema = mongoose.Schema({
    carrito: String,
    productos:{
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'productosagregados'
                }
            }
        ],
        default:[]
    }
})

const CartModel = mongoose.model('carritos', cartSchema)

export default CartModel
