
import TicketModel from "../models/ticket.model.js"

export default class Tickets {
   
    addTicket = async nuevoTicket => {
        const ticket = await TicketModel.create(nuevoTicket)
        const ticketObject = ticket.toObject();
        return  ticketObject}


    
}
