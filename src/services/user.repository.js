export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    getUsers = async username => { return this.dao.getUsers(username) }

    addUsers = async newUser => { return this.dao.addUsers(newUser) }
}

