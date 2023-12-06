import mongoose from "mongoose";

const UserRegisterModel = mongoose.model('user', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: String
   
}))

export default UserRegisterModel