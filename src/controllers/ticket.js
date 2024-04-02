import {
  CartService,
  TicketService,
  ProductService,
} from "../services/index.js";
import logger from "../logging/logger.js";
import { transport } from "../utils.js";
import environmentConfig from "../enviroments.js";

export const generateTicket = async (req, res) => {
  try {
    const user = req.user;

    logger.info(
      `Usuario desde generateTicket: ${user ? user.first_name : "No logueado"}`
    );

    const email = req.user.email;
    logger.debug(`Correo electrónico del usuario: ${email}`);

    let cid;

    try {
      cid = req.params.cid;
      logger.debug(`ID del carrito desde generate ticket: ${cid}`);
    } catch (error) {
      logger.error(`Error al obtener el ID del carrito: ${error.message}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }

    const carrito = await CartService.getCartsById(cid);
    // logger.debug(`Datos del carrito de checkout: ${JSON.stringify(carrito, null, 2)}`);
    logger.debug(
      `Datos del carrito de checkout: ${JSON.stringify(
        carrito.productsToBuy,
        null,
        2
      )}`
    );

    // console.log('carrito de checkout productsToBuy', carrito.productsToBuy)
    let totalCompra;

    const lastTicket = await TicketService.getAllTickets(
      {},
      {},
      { sort: { code: -1 } }
    );
    console.log("lastTicket", lastTicket);

    let newCode;

    if (lastTicket.length > 0) {
      newCode = lastTicket[0].code + 1;
    } else {
      // En caso de que no haya ningún ticket en la base de datos aún
      newCode = 1;
    }

    totalCompra = 0;
    carrito.productsToBuy.forEach((product) => {
      totalCompra += product.product.price * product.quantity;
    });
    //console.log('total compra desde ticket', totalCompra)
    logger.debug(`Total de compra desde ticket: ${totalCompra}`);

    // // Crea una nueva instancia del ticket
    // const nuevoTicket = new TicketModel({
    //   code: newCode,
    //   purchase_datatime: new Date().toISOString(),
    //   amount: totalCompra,
    //   purchaser: email,
    // });

    // Creas el objeto nuevoTicket
    const nuevoTicket = {
      code: newCode,
      purchase_datatime: new Date().toISOString(),
      amount: totalCompra,
      purchaser: email,
    };

    //console.log('crear nuevo ticket', nuevoTicket)
    logger.debug(
      `Nuevo ticket creado: ${JSON.stringify(nuevoTicket, null, 2)}`
    );
    // Guarda el ticket en la base de datos
    // const ticket = await TicketModel.create(nuevoTicket)
    // const ticketObject = ticket.toObject();

    carrito.productosagregados =[] 
    carrito.productsToBuy = []

    await CartService.updateCart(cid, carrito);
    
    const ticket = await TicketService.addTicket(nuevoTicket);


    console.log(' ticket guardado en la base de datos', ticket)
    logger.debug(
      `Ticket guardado en la base de datos: ${JSON.stringify(ticket, null, 2)}`
    );
    //actualizar el stock en la base
    const productsInCart = carrito.productsToBuy;

    for (const productInfo of productsInCart) {
      const productId = productInfo.product._id; // Asume que tienes un campo _id en tu modelo de productos
      const purchasedQuantity = productInfo.quantity;
      const product = await ProductService.getProductsById(productId);
      //console.log('producto a restar cantidas', product)
      //console.log('id del producto a restar stock', productId)
      const updatedStock = product.stock - purchasedQuantity;
      //console.log('updatedStock', updatedStock)
      const actualizar = await ProductService.updateProduct(productId, {
        stock: updatedStock,
      });
      // console.log('acutualizar', actualizar)
    }

    logger.debug("Stock actualizado en la base de datos.");

    const mailOptions = {
      from: "mariaperezcobo@gmail.com",
      to: email, // El correo electrónico del usuario obtenido del req.session.user.email
      subject: "Confirmación de compra!!",
      html: `
      <div>
          <h2> Gracias por su compra!! </h2>
          <h4> El código de la operación es ${ticket.code}</h4><br>
          <p>El total de la compra es de $ ${ticket.amount}</p>
          <p>La compra se realizó el dia ${ticket.purchase_datatime}</p>
                   
      </div>
  `,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        logger.error(`Error al enviar el correo electrónico: ${error.message}`);
      } else {
        logger.info(`Correo electrónico enviado: ${info.response}`);
      }
    });

    const redirectBaseUrl2 = environmentConfig.REDIRECT_URL_LOCAL;
console.log('redirectbase', redirectBaseUrl2)
    res.render("checkout", {
      redirectBaseUrl2,
      carrito,
      ticket,
      style: "index.css",
      title: "Fitness Ropa deportiva",
      user,
    });
  } catch (error) {
    logger.error(`Error al generar el ticket desde post: ${error.message}`);
    res.status(500).json({ error: "Error interno del servidor desde post" });
  }
};

export const generateTicketView = async (req, res) => {
  try {
    const user = req.user;

    logger.info(
      `Usuario desde generateTicket: ${user ? user.first_name : "No logueado"}`
    );

    const email = req.user.email;
    logger.debug(`Correo electrónico del usuario: ${email}`);

    let cid;

    try {
      cid = req.params.cid;
      logger.debug(`ID del carrito desde generate ticket: ${cid}`);
    } catch (error) {
      logger.error(`Error al obtener el ID del carrito: ${error.message}`);
      res.status(500).json({ error: "Error interno del servidor" });
    }

    const carrito = await CartService.getCartsById(cid);
    // logger.debug(`Datos del carrito de checkout: ${JSON.stringify(carrito, null, 2)}`);
    logger.debug(
      `Datos del carrito de checkout: ${JSON.stringify(
        carrito.productsToBuy,
        null,
        2
      )}`
    );

    // console.log('carrito de checkout productsToBuy', carrito.productsToBuy)
    let totalCompra;

    // const lastTicket = await TicketModel.findOne({}, {}, { sort: { 'code': -1 } });
    const lastTicket = await TicketService.getTickets(
      {},
      {},
      { sort: { code: -1 } }
    );
    let newCode;
    if (lastTicket) {
      newCode = lastTicket.code + 1;
    } else {
      // En caso de que no haya ningún ticket en la base de datos aún
      newCode = 1;
    }

    totalCompra = 0;
    carrito.productsToBuy.forEach((product) => {
      totalCompra += product.product.price * product.quantity;
    });
    //console.log('total compra desde ticket', totalCompra)
    logger.debug(`Total de compra desde ticket: ${totalCompra}`);


    // Creas el objeto nuevoTicket
    const nuevoTicket = {
      code: newCode,
      purchase_datatime: new Date().toISOString(),
      amount: totalCompra,
      purchaser: email,
    };

    //console.log('crear nuevo ticket', nuevoTicket)
    logger.debug(
      `Nuevo ticket creado: ${JSON.stringify(nuevoTicket, null, 2)}`
    );
    // Guarda el ticket en la base de datos
    const ticket = await TicketService.addTicket(nuevoTicket);

    //console.log(' ticket guardado en la base de datos', ticket)
    logger.debug(
      `Ticket guardado en la base de datos: ${JSON.stringify(ticket, null, 2)}`
    );
    //actualizar el stock en la base
    const productsInCart = carrito.productsToBuy;

    for (const productInfo of productsInCart) {
      const productId = productInfo.product._id; // Asume que tienes un campo _id en tu modelo de productos
      const purchasedQuantity = productInfo.quantity;
      const product = await ProductService.getProductsById(productId);
      //console.log('producto a restar cantidas', product)
      //console.log('id del producto a restar stock', productId)
      const updatedStock = product.stock - purchasedQuantity;
      //console.log('updatedStock', updatedStock)
      const actualizar = await ProductService.updateProduct(productId, {
        stock: updatedStock,
      });
      // console.log('acutualizar', actualizar)
    }

    logger.debug("Stock actualizado en la base de datos.");

    return res.status(200).json(ticket);
  } catch (error) {
    logger.error(`Error al generar el ticket desde post: ${error.message}`);
    res.status(500).json({ error: "Error interno del servidor desde post" });
  }
};
