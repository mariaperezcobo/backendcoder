export default class UserRepository {
    
    constructor(dao) {
        this.dao = dao
    }

    getUsers = async username => { return this.dao.getUsers(username) }

    addUsers = async () => { return this.dao.addUsers() }
}

