import mongoose from "mongoose";

const UserRegisterModel = mongoose.model(
  "users",
  new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
      type: String,
      required: true,
    },
    age: Number,
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      default: "user", // Valor predeterminado. para generar un usuario admin modificarlo desde mongo
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carritos",
    },
    last_connection: {
      type: Date,
      default: Date.now,
    },
  })
);

export default UserRegisterModel;
