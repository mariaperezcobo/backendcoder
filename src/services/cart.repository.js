export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    
    getCartsById = async cid => { return this.dao.getCartsById(cid) }
    
}
