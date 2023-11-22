import mongoose from 'mongoose'

const productCartSchema = mongoose.Schema({
    title: String,
    price: Number,
   
})

const ProductModel = mongoose.model('productosagregados', productCartSchema)

export default ProductModel