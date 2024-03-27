import { request, response } from "express";
import mongoose from "mongoose";
import ProductsModel from "../dao/models/prodmongoose.models.js";
import CartModel from "../dao/models/cartmongoose.model.js";
import { ProductService, CartService, UserService } from "../services/index.js";
import ProductInsertDTO from "../DTO/products.dto.js";
import logger from "../logging/logger.js";
import nodemailer from "nodemailer";
import { transport } from "../utils.js";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: 587,
//   auth: {
//     user: "mariapcsalem@gmail.com",
//     pass: "ivpkgozjdowugjtv",
//   },
// });

export const getProducts = async (req = request, res = response) => {
  try {
    const user = req.user;
    const cid = req.user.cart;
    console.log(user, "usuario desde getproducts");

    logger.debug("user", user);
    logger.debug("cid", cid);
    console.log("user desde getproducts", user);

    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const query = req.query?.query ?? "";
    const categoria = req.query?.categoria ?? "";
    const stock = req.query?.stock ?? "";
    const precio = req.query?.precio ?? "";

    const search = {};

    if (query) search.title = { $regex: query, $options: "i" };

    if (categoria && categoria !== "todos") {
      search.category = { $regex: categoria, $options: "i" };
    }

    if (stock && stock !== "todos") {
      search.stock = { $gt: 1 };
    }

    let sortDirection = 1;
    if (precio === "menor") {
      sortDirection = 1;
    }
    if (precio === "mayor") {
      sortDirection = -1;
    } else {
      sortDirection = 1;
    }

    const searchQuery = { ...search };
    // const result = await ProductsModel.paginate(searchQuery,{
    //     page,
    //     limit,
    //     lean:true,
    //     sort: {price: sortDirection}
    // })

    const options = {
      page,
      limit,
      lean: true,
      sort: { price: sortDirection },
    };

    //    console.log('ProductService:', ProductService);
    const result = await ProductService.getProductsPaginate(
      searchQuery,
      options
    );

    //const result = await ProductsModel.paginate(searchQuery,options)

    result.query = query;

    result.productsmongoose = result.docs;

    result.query = query;
    delete result.docs;

    if (result.productsmongoose) {
      // Añadir la propiedad 'cid' a cada producto en 'productsmongoose'
      result.productsmongoose.forEach((product) => {
        product.cid = cid;
      });
    }
    //  console.log('Documentos después de agregar "cid":', result);
    //     //console.log('Documentos con precio:', result.productmongoose.price);
    // } else {
    //     console.log('La propiedad "productsmongoose" no está presente en el resultado');
    // }

    //Renderizar la vista
    res.render("list", {
      user,
      //dataToSend,
      result,
      cid,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });

    //return res.status(200).json(result.docs);
  } catch (error) {
    logger.error("Error en getProducts:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductsView = async (req = request, res = response) => {
  try {
    const user = req.user;
    const cid = req.user.cart;

    logger.debug("user", user);
    logger.debug("cid", cid);

    const limit = parseInt(req.query?.limit ?? 10);
    const page = parseInt(req.query?.page ?? 1);
    const query = req.query?.query ?? "";
    const categoria = req.query?.categoria ?? "";
    const stock = req.query?.stock ?? "";
    const precio = req.query?.precio ?? "";

    const search = {};

    if (query) search.title = { $regex: query, $options: "i" };

    if (categoria && categoria !== "todos") {
      search.category = { $regex: categoria, $options: "i" };
    }

    if (stock && stock !== "todos") {
      search.stock = { $gt: 1 };
    }

    let sortDirection = 1;
    if (precio === "menor") {
      sortDirection = 1;
    }
    if (precio === "mayor") {
      sortDirection = -1;
    } else {
      sortDirection = 1;
    }

    const searchQuery = { ...search };
    // const result = await ProductsModel.paginate(searchQuery,{
    //     page,
    //     limit,
    //     lean:true,
    //     sort: {price: sortDirection}
    // })

    const options = {
      page,
      limit,
      lean: true,
      sort: { price: sortDirection },
    };

    //    console.log('ProductService:', ProductService);
    const result = await ProductService.getProductsPaginate(
      searchQuery,
      options
    );

    //const result = await ProductsModel.paginate(searchQuery,options)

    result.query = query;

    result.productsmongoose = result.docs;

    result.query = query;
    delete result.docs;

    if (result.productsmongoose) {
      // Añadir la propiedad 'cid' a cada producto en 'productsmongoose'
      result.productsmongoose.forEach((product) => {
        product.cid = cid;
      });
    }
    //  console.log('Documentos después de agregar "cid":', result);
    //     //console.log('Documentos con precio:', result.productmongoose.price);
    // } else {
    //     console.log('La propiedad "productsmongoose" no está presente en el resultado');
    // }

    return res.status(200).json(result.productsmongoose);
  } catch (error) {
    logger.error("Error en getProducts:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    logger.debug(`ID: ${id}`);

    //const productmongoose = await ProductsModel.findOne({code}).lean().exec()
    const productmongoose = await ProductService.getProductsById(id);

    if (!productmongoose) {
      logger.error("Producto no encontrado");
      return res.status(404).send("Producto no encontrado");
    }

    logger.info(`Producto encontrado: ${productmongoose.title}`);
    // console.log(productmongoose)

    res.render("one", {
      productmongoose,
      user,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error al buscar el producto: ${error.message}`);
    //console.error('Error al buscar el producto:', error);
    res.status(500).send("Error interno del servidor");
  }
};

//para docupentacion - devuelve un json
export const getProductsByIdView = async (req = request, res = response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    logger.debug(`ID: ${id}`);

    //const productmongoose = await ProductsModel.findOne({code}).lean().exec()
    const productmongoose = await ProductService.getProductsById(id);

    if (!productmongoose) {
      logger.warn("Producto no encontrado");
      return res.status(404).send("Producto no encontrado");
    }

    logger.info(`Producto encontrado: ${productmongoose.title}`);
    // console.log(productmongoose)

    return res.status(200).json(productmongoose);
  } catch (error) {
    logger.error(`Error al buscar el producto: ${error.message}`);
    //console.error('Error al buscar el producto:', error);
    res.status(500).send("Error interno del servidor");
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const user = req.user;
    const userId = req.user._id;
    const userRole = req.user.rol;

    console.log(user);
    console.log("userId", userId);

    const productNew = req.body;

    productNew.owner = userId;

    logger.info(`Nuevo producto: ${productNew}`);
    console.log("product new", productNew);
    const productmongooseNew = new ProductInsertDTO(productNew);

    const result = await ProductService.addProduct(productmongooseNew);
    // const result = await ProductsModel.create(productmongooseNew)

    logger.info(`resultado de crear un nuevo producto: ${result}`);
    //console.log('resultado de crear prod', result)
    res.redirect("/productsmongoose");
  } catch (error) {
    logger.error(`Error al crear el producto: ${error.message}`);
    //console.log(error),
    res
      .status(500)
      .send(
        "Error interno del servidor al crear productos con mongoose: " +
          error.message
      );
  }
};

//para docupentacion - devuelve un json
export const addProductView = async (req = request, res = response) => {
  try {
    const user = req.user;
    const userId = req.user._id;
    const userRole = req.user.rol;

    console.log(user);
    console.log(userId);

    const productNew = req.body;

    if (userRole === "premium") {
      productNew.owner = userId;
    } else {
      productNew.owner = "admin";
    }

    logger.info(`Nuevo producto: ${productNew}`);
    //console.log(productNew)
    const productmongooseNew = new ProductInsertDTO(productNew);

    const result = await ProductService.addProduct(productmongooseNew);
    // const result = await ProductsModel.create(productmongooseNew)

    logger.info(`resultado de crear un nuevo producto: ${result}`);
    //console.log('resultado de crear prod', result)
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Error al crear el producto: ${error.message}`);
    //console.log(error),
    res
      .status(500)
      .send(
        "Error interno del servidor al crear productos con mongoose: " +
          error.message
      );
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    // const { user } = req.session;
    const user = req.user;
    console.log("user desde delete", user);

    //console.log('id para elimnar', id)
    logger.debug(`ID para eliminar: ${id}`);

    const product = await ProductService.getProductsById({ _id: id });
    console.log("product desde delete", product);
    if (!product) {
      return res.status(404).json({ error: "El producto no fue encontrado" });
    }

    console.log("prod  a eliminar", product);
    if (!user) {
      res
        .status(401)
        .json({ error: "No estás autorizado para realizar esta acción" });
    }
    // Verificar si el usuario tiene permisos de administrador o es propietario del producto

    if (user.rol === "admin") {
      // Si es un administrador, eliminar el producto directamente
      // await ProductsModel.deleteOne({ _id: id });
      await ProductService.deleteProduct({ _id: id });
      console.log("producto eliminado. el user es admir");

      const idUserdelProduct = product.owner;

      console.log("idUserdelProduct", idUserdelProduct);
      // Buscar al propietario del producto en el modelo de usuarios
      const owner = await UserService.getUsersById({ _id: idUserdelProduct });
      console.log("owner eliminando premium", owner);

      // if (!owner) {
      //   return res
      //     .status(404)
      //     .json({ error: "El propietario del producto no fue encontrado" });
      // }

      // Verificar si el propietario del producto tiene rol premium
      if (owner.rol === "premium") {
        const mailInfoDeleteProduct = {
          from: "mariaperezcobo@gmail.com",
          to: owner.email, // El correo electrónico del usuario obtenido del req.session.user.email
          subject: "Se eliminó un producto creado por tu usuario",
          html: `
    <div>
  
        <h4> El producto eliminado es ${product.title}</h4><br>
    </div>
`,
        };

        transport.sendMail(mailInfoDeleteProduct, function (error, info) {
          if (error) {
            logger.error(
              `Error al enviar el correo electrónico: ${error.message}`
            );
          } else {
            logger.info(`Correo electrónico enviado: ${info.response}`);
          }
        });
      } else {
        console.log("el usuario creador del producto no es premium");
      }
      console.log("se elimino porque el user es admin");
      return res.json({ status: "success" });
    } else if (user.rol === "premium") {
      console.log("el user es premium");
      // Verificar si el propietario del producto es el mismo que el usuario actual

      if (product.owner.toString() === user._id.toString()) {
        // Si es el propietario, eliminar el producto
        //await ProductsModel.deleteOne({ _id: id });
        await ProductService.deleteProduct({ _id: id });
        console.log(
          "producto eliminado. el user es premium y creador del producto"
        );
        return res.json({ status: "success" });
      } else {
        console.log(
          "Un usuario premium solo puede eliminar productos creados por él mismo"
        );
        return res.status(500).json(error);
      }
    } else {
      console.log("No tienes permisos para eliminar este producto..");
      return res.json({
        error: "No tienes permisos para eliminar este producto..",
      });
    }
  } catch (error) {
    logger.error(`Error al eliminar el producto del carrito: ${error.message}`);
    return res.status(500).json(error);
    //console.log(error)
  }
};

export const addProductInCart = async (req = request, res = response) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const user = req.user;

    logger.debug(`CID: ${cid}, PID: ${pid}`);

    let carrito = await CartService.getCartsById(cid);
    console.log("carrito", carrito);
    console.log("user desde addproducts", user);

    console.log("req.user._id.toString()", req.user._id.toString());
    console.log("carrito", carrito);

    if (req?.user && req.user.rol !== "admin") {
      const producto = await ProductService.getProductsById(pid);

      console.log("producto", producto);
      console.log("producto.owner.toString()", producto.owner.toString());

      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      if (producto.owner.toString() === req.user._id.toString()) {
        const alertMessage = "No puedes agregar tu propio producto al carrito";
        return res.send(
          `<script>alert('${alertMessage}'); window.location='/productsmongoose';</script>`
        );

        // return res
        //   .status(403)
        //   .json({ error: "No puedes agregar tu propio producto al carrito" });
      }

      const productoInCart = carrito.productosagregados.find(
        (p) => p.product && p.product._id.toString() === pid
      );

      //    console.log('productoincart',productoInCart)
      if (productoInCart) {
        productoInCart.quantity++;
      } else {
        const newProduct = { product: pid, quantity: 1 };
        carrito.productosagregados.push(newProduct);
      }

      // Actualizar la base de datos con los cambios
      // await CartModel.findByIdAndUpdate(cid, { productosagregados: carrito.productosagregados }, { new: true });
      await CartService.updateCart(cid, {
        productosagregados: carrito.productosagregados,
      });
      //console.log('carrito desp de actualizar',carrito)
    } else {
      logger.info(`Usuario no autorizado`);
      res.status(403).json({
        error:
          "No tienes permisos para agregar un producto al carrito este producto porque no sos user",
      });
    }
  } catch (error) {
    logger.error(`Error al agregar producto al carrito: ${error.message}`);
    res.status(500).json({ error: "error 3", details: error.message });
  }
};

export const updateProductBase = async (req = request, res = response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    logger.debug(`ID para actualizar: ${id}`);

    const updatedProductData = req.body;

    const updatedProduct = await ProductService.updateProduct(
      id,
      updatedProductData
    );
    //const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedProductData, { new: true });

    if (updatedProduct) {
      res.redirect("/productsmongoose");
    } else {
      logger.warn(`Error al actualizar el producto: ${error.message}`);
      res.status(404).json({
        error: "Producto no encontrado o no se realizaron modificaciones",
      });
    }
  } catch (error) {
    logger.error(`Error al actualizar el producto: ${error.message}`);
    //console.error('Error in update product route:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//para docupentacion - devuelve un json
export const updateProductBaseView = async (req = request, res = response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    logger.debug(`ID para actualizar: ${id}`);

    const updatedProductData = req.body;

    const updatedProduct = await ProductService.updateProduct(
      id,
      updatedProductData
    );
    //const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedProductData, { new: true });

    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      logger.warn(`Error al actualizar el producto: ${error.message}`);
      res.status(404).json({
        error: "Producto no encontrado o no se realizaron modificaciones",
      });
    }
  } catch (error) {
    logger.error(`Error al actualizar el producto: ${error.message}`);
    //console.error('Error in update product route:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateProductForm = async (req = request, res = response) => {
  const { id } = req.params;

  const productmongoose = await ProductService.getProductsById(id);

  if (!productmongoose) {
    // Si el producto no se encuentra, puedes manejarlo de alguna manera
    return res.status(404).send("Producto no encontrado");
  }

  res.render("update", {
    productmongoose,
    style: "index.css",
    title: "Fitness Ropa deportiva",
  });
};

export const createProduct = (req = request, res = response) => {
  res.render("create", {
    style: "index.css",
    title: "Fitness Ropa deportiva",
  });
};
