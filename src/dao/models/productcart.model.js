import mongoose from 'mongoose'

const productCartSchema = mongoose.Schema({
    title: String,
   
})

const productModel = mongoose.model('productosagregados', productCartSchema)

export default productModel