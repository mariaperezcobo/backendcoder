import { Router } from "express";

import {
  addProduct,
  addProductInCart,
  deleteProduct,
  getProducts,
  getProductsById,
  createProduct,
  updateProductBase,
  updateProductForm,
  getProductsView,
  getProductsByIdView,
  addProductView,
  updateProductBaseView,
} from "../controllers/products.js";
//import { isAdmin, isAdminEliminate, isUser } from "../controllers/sessions.js";
import {
  isAdmin,
  isAdminEliminate,
  isUser,
} from "../middlewares/session.middlewares.js";
import passport from "passport";
import { auth } from "../middlewares/session.middlewares.js";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getProducts);

// //con jwt
// router.get("/", passport.authenticate(`jwt`, { seccion: false }), getProducts);

//para documentacion - devuelve un json
//router.get("/api", auth, getProductsView);
router.get("/api", getProductsView);

router.post("/", addProduct);

//para documentacion - devuelve un json
router.post("/api", addProductView);

router.get("/create", isAdmin, createProduct);

//router.get('/:code', getProductsById)
router.get("/:id", getProductsById);

//para documentacion - devuelve un json
router.get("/api/:id", getProductsByIdView);

//router.delete("/:id", isAdminEliminate, deleteProduct);
router.delete("/:id", deleteProduct);

//para documentacion - devuelve un json
//router.delete("/api/:id", isAdminEliminate, deleteProduct);
router.delete("/api/:id", deleteProduct);

//router.post("/:cid/product/:pid", isUser, addProductInCart);
router.post("/:cid/product/:pid", addProductInCart);

// router.get("/:id/update", isAdmin, updateProductForm);

// router.post("/:id/update", isAdmin, updateProductBase);

router.get("/:id/update", updateProductForm);

router.post("/:id/update", updateProductBase);

//para documentacion - devuelve un json
//router.post("/:id/api/update", isAdmin, updateProductBaseView);
router.post("/:id/api/update", updateProductBaseView);

export default router;
