import mongoose from 'mongoose'

// const cartCollection = 'cartmongoose'

const cartSchema = mongoose.Schema({
    name: String,
    productosagregados:{
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'productsmongooses'
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ],
        default:[]
    }
})

cartSchema.pre('findOne', function(next){
    this.populate('productosagregados.product');
    next();
})

const CartModel = mongoose.model('carritos', cartSchema)

export default CartModel
