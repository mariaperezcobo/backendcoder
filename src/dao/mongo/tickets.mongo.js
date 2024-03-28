import TicketModel from "../models/ticket.model.js";

export default class Tickets {
  addTicket = async (nuevoTicket) => {
    const ticket = await TicketModel.create(nuevoTicket);
    const ticketObject = ticket.toObject();
    return ticketObject;
  };

  getTickets = async (code) => {
    return TicketModel.findOne(code);
  };

  getAllTickets = async () => {
    const tickets = await TicketModel.find();
    return tickets.sort((a, b) => b.code - a.code);

    //return TicketModel.find().sort({ code: -1 });
  };
}
