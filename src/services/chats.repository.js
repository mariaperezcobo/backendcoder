export default class ChatRepository {
    constructor(dao) {
        this.dao = dao
       // console.log('this.dao:', this.dao);
    }

    getChats = async () => { return this.dao.getChats() }
    
    addChats = async (chat) => { return this.dao.addChats(chat) }
    
    
}


