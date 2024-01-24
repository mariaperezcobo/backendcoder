import TicketModel from '../dao/models/ticket.model.js'
import { CartService, TicketService, ProductService } from '../services/index.js';

export const generateTicket = async (req, res) => {
    try {
        const user = req.session.user
        console.log('user desde ticket', user)
      const email = req.session.user.email;

         console.log('user', user)
         console.log('email', email)

        let cid 
        
        try{
            cid = req.params.cid
            console.log('id desde el generate ticket', cid)
        }catch(error){
            console.error('Error al generar el ticket:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

     
     

        const carrito = await CartService.getCartsById(cid)
        console.log('carrito de checkout', carrito)
        console.log('carrito de checkout productsToBuy', carrito.productsToBuy)
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
console.log('total compra desde ticket', totalCompra)


        // Crea una nueva instancia del ticket
        const nuevoTicket = new TicketModel({
            code: newCode, 
            purchase_datatime: new Date().toISOString(),
            amount: totalCompra,
            purchaser: email, 
        });
        console.log('crear nuevo ticket', nuevoTicket)

        // Guarda el ticket en la base de datos
        // const ticket = await TicketModel.create(nuevoTicket)
        // const ticketObject = ticket.toObject();

        const ticket = await TicketService.addTicket(nuevoTicket)
        

        console.log(' ticket guardado en la base de datos', ticket)

        //actualizar el stock en la base
        const productsInCart = carrito.productosagregados

        for (const productInfo of productsInCart) {
            const productId = productInfo.product._id; // Asume que tienes un campo _id en tu modelo de productos
            const purchasedQuantity = productInfo.quantity;
            const product = await ProductService.getProductsById(productId);
            console.log('producto a restar cantidas', product)
            console.log('id del producto a restar stock', productId)
            const updatedStock = product.stock - purchasedQuantity;
            console.log('updatedStock', updatedStock)
            const actualizar = await ProductService.updateProduct(productId, {stock: updatedStock} );
            console.log('acutualizar', actualizar)
        }

        

         
        
        res.render('checkout', {
           ticket,
           style: 'index.css',
           title: 'Fitness Ropa deportiva',
           user,
           
       })

    } catch (error) {
        console.error('Error al generar el ticket desde post:', error);
        res.status(500).json({ error: 'Error interno del servidor desde post' });
    }
}

