import mongoose from 'mongoose'

const productsCollection = 'productsmongoose'

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true
    },
    price: Number,
    thumbnail: String,
    description: String,
    category: String,
    code: String,
    status: String,
    stock: Number,
})

const ProductsModel = mongoose.model(productsCollection, productsSchema)

export default ProductsModel