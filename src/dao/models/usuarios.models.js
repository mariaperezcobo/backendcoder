//para pagination clase 17

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const usuarioSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
})

usuarioSchema.plugin(mongoosePaginate)
const usuarioModel = mongoose.model('usuarios', usuarioSchema)

export default usuarioModel