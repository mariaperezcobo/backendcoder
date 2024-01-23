import TicketModel from '../dao/models/ticket.model.js'
import { CartService, TicketService, ProductService } from '../services/index.js';

export const generateTicket = async (req, res) => {
    try {
        let cid 
        
        try{
            cid = req.params.cid
            console.log('id desde el generate ticket', cid)
        }catch(error){
            console.error('Error al generar el ticket:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }

     
          const user = req.session.user
        const email = req.session.user.email;

           console.log('user', user)
           console.log('email', email)

        const carrito = await CartService.getCartsById(cid)
        console.log('carrito de checkout', carrito)
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


        
        try{
            totalCompra = carrito.productosagregados.reduce((acc, product) => acc + product.product.price * product.quantity, 0)
            console.log('totalcompra',totalCompra)
          
        }catch(error){
            console.error('error en calcular total compra', error)
        }



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
           
       })

    } catch (error) {
        console.error('Error al generar el ticket desde post:', error);
        res.status(500).json({ error: 'Error interno del servidor desde post' });
    }
}

