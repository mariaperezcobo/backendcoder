export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
       // console.log('this.dao:', this.dao);
    }

    addTicket = async (nuevoTicket) => { return this.dao.addTicket(nuevoTicket) }
    
    getTickets =  async code => { return this.dao.getTickets(code) }
}
