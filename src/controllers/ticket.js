import TicketModel from '../dao/models/ticket.model.js'
import { CartService } from '../services/index.js';

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

        function generarCodigo() {
            const codigo = Math.floor(1000 + Math.random() * 9000);
            return codigo;
          }
          
          const codigoGenerado = generarCodigo();

        try{
            totalCompra = carrito.productosagregados.reduce((acc, product) => acc + product.product.price * product.quantity, 0)
            console.log('totalcompra',totalCompra)
          
        }catch(error){
            console.error('error en calcular total compra', error)
        }

        // Crea una nueva instancia del ticket
        const nuevoTicket = new TicketModel({
            code: codigoGenerado,  // Puedes ajustar esto según tu lógica para generar códigos de operación
            purchase_datatime: new Date().toISOString(),
            amount: totalCompra,
            purchaser: email, 
        });
        console.log('crear nuevo ticket', nuevoTicket)

        // Guarda el ticket en la base de datos
        const ticket = await TicketModel.create(nuevoTicket)

        const ticketObject = ticket.toObject();
        console.log(' ticket guardado en la base de datos', ticket)
        
        res.render('checkout', {
           ticket: ticketObject,
           style: 'index.css',
           title: 'Fitness Ropa deportiva',
           
       })

    } catch (error) {
        console.error('Error al generar el ticket desde post:', error);
        res.status(500).json({ error: 'Error interno del servidor desde post' });
    }
};

// export const generateTicketView = async (req,res) => {
//     try {
//         try{
//             const cid = req.params.cid
//             console.log('id desde el generate ticket', cid)
//             const user = req.session.user
//             const email = req.session.user.email;

//            console.log('user', user)
//            console.log('email', email)


//         }catch(error){
//             console.error('Error al generar el ticket desde ruta get:', error);
//             res.status(500).json({ error: 'Error interno del servidor desde get' });
//         }
        
       
//         res.render('checkout', {
          
//            style: 'index.css',
//            title: 'Fitness Ropa deportiva',
           
//        })

//     } catch (error) {
//         console.error('Error al generar el ticket:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// };
