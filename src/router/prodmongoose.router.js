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
} from "../middlewares/session.middlewares.js";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getProducts);

//para documentacion - devuelve un json
//router.get("/api", auth, getProductsView);

router.get(
  "/api",
  passport.authenticate("jwt", { session: false }),
  getProductsView
);

router.post("/", passport.authenticate("jwt", { session: false }), addProduct);

//para documentacion - devuelve un json
router.post("/api", addProductView);

router.get(
  "/create",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  createProduct
);

//router.get('/:code', getProductsById)
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getProductsById
);

//para documentacion - devuelve un json
router.get(
  "/api/:id",
  passport.authenticate("jwt", { session: false }),
  getProductsByIdView
);

//router.delete("/:id", isAdminEliminate, deleteProduct);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdminEliminate,
  deleteProduct
);

//para documentacion - devuelve un json
//router.delete("/api/:id", isAdminEliminate, deleteProduct);
router.delete(
  "/api/:id",
  passport.authenticate("jwt", { session: false }),
  isAdminEliminate,
  deleteProduct
);

//router.post("/:cid/product/:pid", isUser, addProductInCart);
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),

  addProductInCart
);

router.get(
  "/:id/update",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateProductForm
);

router.post(
  "/:id/update",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateProductBase
);

router.get(
  "/:id/update",
  passport.authenticate("jwt", { session: false }),
  updateProductForm
);

router.post(
  "/:id/update",
  passport.authenticate("jwt", { session: false }),
  updateProductBase
);

//para documentacion - devuelve un json
//router.post("/:id/api/update", isAdmin, updateProductBaseView);

router.post(
  "/:id/api/update",
  passport.authenticate("jwt", { session: false }),
  updateProductBaseView
);

export default router;
