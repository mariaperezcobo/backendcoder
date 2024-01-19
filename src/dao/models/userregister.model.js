import mongoose from "mongoose";

const UserRegisterModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carritos'
    }
   
}))

export default UserRegisterModel