import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'productsmongooses'

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        // unique: true
    },
    price: Number,
    thumbnail: String,
    description: String,
    category: String,
    code: String,
    status: String,
    stock: Number,
    owner: String,

})

productsSchema.plugin(mongoosePaginate)
const ProductsModel = mongoose.model(productsCollection, productsSchema)

export default ProductsModel