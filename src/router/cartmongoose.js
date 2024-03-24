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
  getCartStock,
} from "../controllers/carts.js";
import { generateTicket, generateTicketView } from "../controllers/ticket.js";
//import { isUser } from "../controllers/sessions.js";
import { isUser } from "../middlewares/session.middlewares.js";
import passport from "passport";

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
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),

  getCartById
);

//para ver por documentacion swagger
router.get(
  "/api/:cid",
  passport.authenticate("jwt", { session: false }),
  isUser,
  getCartByIdView
);

//para crear un carrito
router.post("/", createCart);

router.post("/api", createCartView);

//para eliminar un producto del carrito
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProductInCart
);

router.delete(
  "/api/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  deleteProductInCart
);

//para eliminar carrito
router.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  deleteAllProductsInCart
);

//para ver por documentacion swagger
router.delete(
  "/api/:cid",
  passport.authenticate("jwt", { session: false }),
  deleteAllProductsInCart
);

router.get(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  getCartToBuy
);

router.get(
  "/:cid/stock",
  passport.authenticate("jwt", { session: false }),
  getCartStock
);

router.get(
  "/api/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  getCartToBuyView
);

router.post(
  "/:cid/purchase/checkout",
  passport.authenticate("jwt", { session: false }),
  generateTicket
);

router.get("/:cid/purchase/checkout", generateTicket);

//para swagger
router.get("/api/:cid/purchase/checkout", generateTicketView);
router.post("/api/:cid/purchase/checkout", generateTicketView);
export default router;
