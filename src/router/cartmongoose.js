//cart con mongoose (la parte de agregar el producto a un carrito esta en otrocart.router)

import { Router } from "express";
//import mongoose from 'mongoose'
// import CartModel from '../dao/models/cartmongoose.model.js'
// import ProductModel from '../dao/models/productcart.model.js'
// import ProductsModel from '../dao/models/prodmongoose.models.js'
import {
  deleteProductInCart,
  getCartById,
  deleteAllProductsInCart,
  createCart,
  getCartToBuy,
  createCartView,
  getCartByIdView,
  getCartToBuyView,
} from "../controllers/carts.js";
import { generateTicket, generateTicketView } from "../controllers/ticket.js";
import { isUser } from "../controllers/sessions.js";

//inicializamos variables
// const url = 'mongodb+srv://mariaperezcobo:t5pFMZnlhzX5AsFQ@clustermaria.jeh0zpu.mongodb.net/'
// const mongodbName = 'ecommerce'

// //conectamos a db y corremos el server
// await mongoose.connect(url, {dbName: mongodbName})
//     .then(()=>{
//         console.log('DB connected')
//     })
//     .catch(e=>{
//         console.error('error conectando a la base de datos')
//     })

const router = Router();

//para ver los carritos
//router.get('/', seeCarts)

//para ver un carrito especifico
router.get("/:cid", isUser, getCartById);

//para ver por documentacion swagger
router.get("/api/:cid", isUser, getCartByIdView);

//para crear un carrito
router.post("/", createCart);

router.post("/api", createCartView);

//para eliminar un producto del carrito
router.delete("/:cid/product/:pid", deleteProductInCart);

router.delete("/api/:cid/product/:pid", deleteProductInCart);

//para eliminar carrito
router.delete("/:cid", deleteAllProductsInCart);

//para ver por documentacion swagger
router.delete("/api/:cid", deleteAllProductsInCart);

router.get("/:cid/purchase", getCartToBuy);

router.get("/api/:cid/purchase", getCartToBuyView);

router.post("/:cid/purchase/checkout", generateTicket);

router.get("/:cid/purchase/checkout", generateTicket);

//para swagger
router.get("/api/:cid/purchase/checkout", generateTicketView);
router.post("/api/:cid/purchase/checkout", generateTicketView);
export default router;
