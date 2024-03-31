import { Router } from "express";
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
import { isUser, noIsAdminOnly } from "../middlewares/session.middlewares.js";
import passport from "passport";

const router = Router();

//para ver los carritos
//router.get('/', seeCarts)

//para ver un carrito especifico
router.get(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  noIsAdminOnly,
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

//para vaciar un carrito
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

//controla si hay stock y calcula el monto de la compra final
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

router.get(
  "/:cid/purchase/checkout",
  passport.authenticate("jwt", { session: false }),
  generateTicket
);

//para swagger
router.get("/api/:cid/purchase/checkout", generateTicketView);
router.post("/api/:cid/purchase/checkout", generateTicketView);

export default router;
