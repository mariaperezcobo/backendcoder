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
import {
  isAdmin,
  isAdminEliminate,
  requireAuth,
  noIsAdminOnly,
  isAdminOnly,
} from "../middlewares/session.middlewares.js";
import passport from "passport";

const router = Router();

router.get("/", requireAuth, getProducts);

//para documentacion - devuelve un json
//router.get("/api", auth, getProductsView);

router.get("/api", requireAuth, getProductsView);

router.post("/", requireAuth, isAdmin, addProduct);

//para documentacion - devuelve un json
router.post("/api", addProductView);

router.get("/create", requireAuth, isAdmin, createProduct);

//router.get('/:code', getProductsById)
router.get("/:id", requireAuth, getProductsById);

//para documentacion - devuelve un json
router.get(
  "/api/:id",
  passport.authenticate("jwt", { session: false }),
  getProductsByIdView
);

router.delete("/:id", requireAuth, isAdmin, deleteProduct);

//para documentacion - devuelve un json
router.delete("/api/:id", requireAuth, isAdmin, deleteProduct);

router.post("/:cid/product/:pid", requireAuth,noIsAdminOnly,  addProductInCart);

router.get("/:id/update", requireAuth, isAdmin, updateProductForm);

router.post("/:id/update", requireAuth, isAdmin, updateProductBase);

//para documentacion - devuelve un json
//router.post("/:id/api/update", isAdmin, updateProductBaseView);

router.post("/:id/api/update", requireAuth, updateProductBaseView);

export default router;
