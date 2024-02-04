import TicketModel from '../dao/models/ticket.model.js'
import { CartService, TicketService, ProductService } from '../services/index.js';
import logger from '../logging/logger.js'

export const generateTicket = async (req, res) => {
    try {
        const user = req.session.user

        logger.info(`Usuario desde generateTicket: ${user ? user.first_name : 'No logueado'}`);
         
       const email = req.session.user.email;
      logger.debug(`Correo electrónico del usuario: ${email}`);
       

        let cid 
        
        try{
            cid = req.params.cid
            logger.debug(`ID del carrito desde generate ticket: ${cid}`);
            
        }catch(error){
            logger.error(`Error al obtener el ID del carrito: ${error.message}`);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

     
     

        const carrito = await CartService.getCartsById(cid)
       // logger.debug(`Datos del carrito de checkout: ${JSON.stringify(carrito, null, 2)}`);
        logger.debug(`Datos del carrito de checkout: ${JSON.stringify(carrito.productsToBuy, null, 2)}`);
     
       // console.log('carrito de checkout productsToBuy', carrito.productsToBuy)
        let totalCompra

       // const lastTicket = await TicketModel.findOne({}, {}, { sort: { 'code': -1 } });
        const lastTicket = await TicketService.getTickets({}, {}, { sort: { 'code': -1 } });
        let newCode;
    if (lastTicket) {
      newCode = lastTicket.code + 1;
    } else {
    // En caso de que no haya ningún ticket en la base de datos aún
    newCode = 1;
}


totalCompra = 0;
carrito.productsToBuy.forEach(product => {
    totalCompra += product.product.price * product.quantity;
});
//console.log('total compra desde ticket', totalCompra)
logger.debug(`Total de compra desde ticket: ${totalCompra}`);

        // Crea una nueva instancia del ticket
        const nuevoTicket = new TicketModel({
            code: newCode, 
            purchase_datatime: new Date().toISOString(),
            amount: totalCompra,
            purchaser: email, 
        });
        //console.log('crear nuevo ticket', nuevoTicket)
        logger.debug(`Nuevo ticket creado: ${JSON.stringify(nuevoTicket, null, 2)}`);
        // Guarda el ticket en la base de datos
        // const ticket = await TicketModel.create(nuevoTicket)
        // const ticketObject = ticket.toObject();

        const ticket = await TicketService.addTicket(nuevoTicket)
        

        //console.log(' ticket guardado en la base de datos', ticket)
        logger.debug(`Ticket guardado en la base de datos: ${JSON.stringify(ticket, null, 2)}`);
        //actualizar el stock en la base
        const productsInCart = carrito.productsToBuy

        for (const productInfo of productsInCart) {
            const productId = productInfo.product._id; // Asume que tienes un campo _id en tu modelo de productos
            const purchasedQuantity = productInfo.quantity;
            const product = await ProductService.getProductsById(productId);
            //console.log('producto a restar cantidas', product)
            //console.log('id del producto a restar stock', productId)
            const updatedStock = product.stock - purchasedQuantity;
            //console.log('updatedStock', updatedStock)
            const actualizar = await ProductService.updateProduct(productId, {stock: updatedStock} );
            console.log('acutualizar', actualizar)
        }

        logger.debug('Stock actualizado en la base de datos.');

        
        res.render('checkout', {
            carrito,
           ticket,
           style: 'index.css',
           title: 'Fitness Ropa deportiva',
           user,
           
       })

    } catch (error) {
        logger.error(`Error al generar el ticket desde post: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor desde post' });
    }
}

