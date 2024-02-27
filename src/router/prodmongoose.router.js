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
import { isAdmin, isAdminEliminate, isUser } from "../controllers/sessions.js";

const router = Router();

function auth(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect("/login");
}

router.get("/", auth, getProducts);

//para documentacion - devuelve un json
router.get("/api", auth, getProductsView);

router.post("/", addProduct);

//para documentacion - devuelve un json
router.post("/api", addProductView);

router.get("/create", isAdmin, createProduct);

//router.get('/:code', getProductsById)
router.get("/:id", getProductsById);

//para documentacion - devuelve un json
router.get("/api/:id", getProductsByIdView);

router.delete("/:id", isAdminEliminate, deleteProduct);

router.post("/:cid/product/:pid", isUser, addProductInCart);

router.get("/:id/update", isAdmin, updateProductForm);

router.post("/:id/update", isAdmin, updateProductBase);

//para documentacion - devuelve un json
router.post("/:id/api/update", isAdmin, updateProductBaseView);

export default router;
