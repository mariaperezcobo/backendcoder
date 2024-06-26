import { request, response } from "express";
import { CartService } from "../services/index.js";
import logger from "../logging/logger.js";

export const getCartById = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const user = req.user;

    logger.info(
      `CID desde getCartById: ${cid}, User: ${
        user ? user.first_name : "Not logged in"
      }`
    );

    const carrito = await CartService.getCartsById(cid);
    //console.log('carrito', carrito)

    if (!carrito) {
      logger.debug(`Carrito no encontrado`);
      return res.status(404).json({ error: "cart not found" });
    }

    // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
    carrito.productosagregados = carrito.productosagregados.map((product) => {
      return {
        ...product,
        cid: cid,
      };
    });
  
    logger.debug(
      `Datos del carrito desde getCartById: ${JSON.stringify(carrito, null, 2)}`
    );


    res.render("cartone", {
      carrito,
      user,
      cid,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error al obtener el carrito: ${error.message}`);
  
  }
};

//para ver documentacion swagger
export const getCartByIdView = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const user = req.user;

    logger.info(
      `CID desde getCartById: ${cid}, User: ${
        user ? user.first_name : "Not logged in"
      }`
    );

    const carrito = await CartService.getCartsById(cid);


    if (!carrito) {
      logger.debug(`Carrito no encontrado`);
      return res.status(404).json({ error: "cart not found" });
    }

    // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
    carrito.productosagregados = carrito.productosagregados.map((product) => {
      return {
        ...product,
        cid: cid,
      };
    });
 
    logger.debug(
      `Datos del carrito desde getCartById: ${JSON.stringify(carrito, null, 2)}`
    );


    return res.status(200).json(carrito);
  } catch (error) {
    logger.error(`Error al obtener el carrito: ${error.message}`);
   
  }
};

export const deleteProductInCart = async (req = request, res = response) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const carrito = await CartService.getCartsById(cid);


    carrito.productosagregados = carrito.productosagregados.filter(
      (p) => p._id.toString() !== pid
    );
  

    logger.info(`Eliminación exitosa - CID: ${cid}, PID: ${pid}`);
    logger.debug(
      `Carrito actualizado después de la eliminación: ${JSON.stringify(
        carrito,
        null,
        2
      )}`
    );

    carrito.productsToBuy = [];
    carrito.otherProducts = [];

    await CartService.updateCart(cid, {
      productosagregados: carrito.productosagregados,
      otherProducts: carrito.otherProducts,
      productsToBuy: carrito.productsToBuy,
    });
    

    return res.status(200).json({ message: "Eliminación exitosa" });
  } catch (error) {
    logger.error(`Error al eliminar producto del carrito: ${error.message}`);
    return res.status(500).json({ error: "error", details: error.message });
  }
};

export const deleteAllProductsInCart = async (
  req = request,
  res = response
) => {
  try {
    const cid = req.params.cid;

    const carrito = await CartService.getCartsById(cid);

    carrito.productosagregados = [];
    carrito.productsToBuy = [];
    carrito.otherProducts = [];

    await CartService.updateCart(cid, {
      productosagregados: carrito.productosagregados,
      otherProducts: carrito.otherProducts,
      productsToBuy: carrito.productsToBuy,
    });
    

    return res.json({ msg: "carrito actualizado!", carrito });
  } catch (error) {
    logger.error(`Error al vaciar el carrito: ${error.message}`);
    return res.status(500).json({ error: "error", details: error.message });
  }
};

export const getCartToBuy = async (req = request, res = response) => {
  try {
    const { cid } = req.params;

    logger.info(`CID desde getCartToBuy: ${cid}`);
  

    let carrito = await CartService.getCartsById(cid);

    if (!carrito) {
      logger.debug(`Cart no encontrado`);
      return res.status(404).json({ error: "cart not found" });
    }

    // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
    carrito.productosagregados = carrito.productosagregados.map((product) => {
      return {
        ...product,
        cid: cid,
      };
    });

    let stockAlert = "";
    let productsToBuy = [];

    let otherProducts = [];

    carrito.productosagregados.forEach((product) => {
      const stockDisponible = product.product.stock;

      console.log("stock disponible", stockDisponible);

      if (product.quantity <= stockDisponible) {
        // Si la cantidad solicitada es mayor que el stock, ajustar la cantidad al stock disponible

        productsToBuy.push(product);
        // logger.debug(`Producto agregado a la compra: ${JSON.stringify(product, null, 2)}`);
        logger.debug(
          `Productos a comprar: ${JSON.stringify(productsToBuy, null, 2)}`
        );
        //  console.log('productsToBuy', productsToBuy)
      } else {
        if (stockDisponible > 0) {
          productsToBuy.push({
            ...product,
            quantity: stockDisponible,
          });
        }

        logger.debug(
          `productsToBuy despues de validar stock: ${JSON.stringify(
            productsToBuy
          )}`
        );

        const remainingUnits = product.quantity - stockDisponible;

        if (remainingUnits > 0) {
          otherProducts.push({
            ...product,
            quantity: remainingUnits,
          });


          // Enviar un mensaje de alerta a la vista
          stockAlert =
            "No tenemos suficiente stock para algunos productos, ajustamos la cantidad en el carrito";
          logger.debug(
            `No hay suficiente stock para ${remainingUnits} unidades de ${product.product.title}`
          );
        }
      }
    });

    if (productsToBuy.length === 0) {
      // If productsToBuy is an empty array, redirect to /products
      return res.redirect(`/cartmongoose/${cid}/stock`);
    }

    // Crear objeto con propiedades actualizadas
    const updatedCart = {
      ...carrito,
      productsToBuy: productsToBuy,
      otherProducts: otherProducts,
    };
    logger.info("updatedCart", updatedCart);
 
    await CartService.updateCart(cid, updatedCart);
    let totalCompra;

    carrito = await CartService.getCartsById(cid);

    // Calcular el total de la compra
    totalCompra = 0;
    productsToBuy.forEach((product) => {
      totalCompra += product.product.price * product.quantity;
    });

    logger.info(`Compra total - CID: ${cid}, Total de compra: ${totalCompra}`);
  
    res.render("purchase", {
      carrito,
      totalCompra,
      cid,
      style: "index.css",
      title: "Fitness Ropa deportiva",
      stockAlert,
    });
  } catch (error) {
    logger.error(`Error en getCartToBuy: ${error.message}`);

  }
};

export const getCartStock = async (req = request, res = response) => {
  try {
    const { cid } = req.params;

    logger.info(`CID desde getCartToBuyStock: ${cid}`);

    const carrito = await CartService.getCartsById(cid);

    if (!carrito) {
      logger.debug(`Cart no encontrado`);
      return res.status(404).json({ error: "cart not found" });
    }
    console.log("carrito desde stock", carrito.productosagregados);
    res.render("stock", {
      carrito,
      cid,
      style: "index.css",
      title: "Fitness Ropa deportiva",
    });
  } catch (error) {
    logger.error(`Error en getCartToBuy: ${error.message}`);

  }
};

//para swagger que devuelve json
export const getCartToBuyView = async (req = request, res = response) => {
  try {
    const { cid } = req.params;

    logger.info(`CID desde getCartToBuy: ${cid}`);
    //console.log('cid desde el controller', cid)

    const carrito = await CartService.getCartsById(cid);

    if (!carrito) {
      logger.debug(`Cart no encontrado`);
      return res.status(404).json({ error: "cart not found" });
    }

    // Agregar la propiedad 'cid' a cada producto en 'productosagregados'
    carrito.productosagregados = carrito.productosagregados.map((product) => {
      return {
        ...product,
        cid: cid,
      };
    });

    let stockAlert = "";
    let productsToBuy = [];

    let otherProducts = [];

    carrito.productosagregados.forEach((product) => {
      const stockDisponible = product.product.stock;

      console.log("stockdisponible", stockDisponible);
      if (product.quantity <= stockDisponible) {
        // Si la cantidad solicitada es mayor que el stock, ajustar la cantidad al stock disponible

        productsToBuy.push(product);
        // logger.debug(`Producto agregado a la compra: ${JSON.stringify(product, null, 2)}`);
        logger.debug(
          `Productos a comprar: ${JSON.stringify(productsToBuy, null, 2)}`
        );
        //  console.log('productsToBuy', productsToBuy)
      } else {
        if (stockDisponible > 0) {
          productsToBuy.push({
            ...product,
            quantity: stockDisponible,
          });
        }
        logger.debug(
          `productsToBuy despues de validar stock: ${JSON.stringify(
            productsToBuy
          )}`
        );

        const remainingUnits = product.quantity - stockDisponible;

        if (remainingUnits > 0) {
          otherProducts.push({
            ...product,
            quantity: remainingUnits,
          });

          //otherProducts.push(product)
          console.log("otherProducts", otherProducts);
          // Enviar un mensaje de alerta a la vista
          stockAlert =
            "No tenemos suficiente stock para algunos productos, ajustamos la cantidad en el carrito";
          logger.debug(
            `No hay suficiente stock para ${remainingUnits} unidades de ${product.product.title}`
          );
        }
      }
    });

    if (productsToBuy.length === 0) {
      // If productsToBuy is an empty array, redirect to /products
      return res.redirect("/productsmongoose");
    }

    // Crear objeto con propiedades actualizadas
    const updatedCart = {
      ...carrito,
      productsToBuy: productsToBuy,
      otherProducts: otherProducts,
    };

    //  await CartService.updateCart(cid, { productosagregados: carrito.productosagregados });
    await CartService.updateCart(cid, updatedCart);
    let totalCompra;

    // Calcular el total de la compra
    totalCompra = 0;
    productsToBuy.forEach((product) => {
      totalCompra += product.product.price * product.quantity;
    });

    logger.info(`Compra total - CID: ${cid}, Total de compra: ${totalCompra}`);
    //console.log('total compra desde getcart', totalCompra)

    return res.status(200).json(updatedCart);
  } catch (error) {
    logger.error(`Error en getCartToBuy: ${error.message}`);

    // console.log('error', error)
  }
};

//     export const seeCarts =async(req=request,res=response)=>{
//         try{
//             const carritosmongoose = await CartModel.find().populate('productosagregados.product').lean().exec()
//            // console.log(carritosmongoose)

//             // const result = await ProductsModel.find().lean().exec()
//             // result.productsmongoose = result.docs

//             res.render('cartmongoose',{
//                 carritosmongoose,
//                 style: 'index.css',
//                 title: 'Fitness Ropa deportiva',
//             })

//         }catch (error){
//             console.error('error',error)

//         }
//  }

export const createCart = async (req = request, res = response) => {
  try {
    const carritoNew = req.body;
    const resultcarrito = await CartService.addCart(carritoNew);
    console.log(resultcarrito);
    res.redirect("/cartmongoose");
  } catch (error) {
    logger.error(`Error al el carrito: ${error.message}`);
    res.send("error al crear el carrito");
  }
};

//para documentacion con swagger
export const createCartView = async (req = request, res = response) => {
  try {
    const carritoNew = req.body;
    const resultcarrito = await CartService.addCart(carritoNew);
    return res.status(200).json(resultcarrito);
  } catch (error) {
    logger.error(`Error al el carrito: ${error.message}`);
    // console.log(error),
    res.send("error al crear el carrito");
  }
};
