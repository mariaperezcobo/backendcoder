export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
    // console.log('this.dao:', this.dao);
  }

  addTicket = async (nuevoTicket) => {
    return this.dao.addTicket(nuevoTicket);
  };

  getTickets = async (code) => {
    return this.dao.getTickets(code);
  };
  getAllTickets = async () => {
    const tickets = await this.dao.getAllTickets();
    return tickets.sort((a, b) => b.code - a.code);
    //return this.dao.getAllTickets().sort({ code: -1 });
  };
}
