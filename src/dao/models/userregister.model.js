import mongoose from "mongoose";

const UserRegisterModel = mongoose.model('usuario', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
   
}))

export default UserRegisterModel