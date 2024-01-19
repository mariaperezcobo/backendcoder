export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => { return this.dao.getCarts() }
    getCartsById = async cid => { return this.dao.getCartsById(cid) }
    
    addCart = async () => { return this.dao.addCart() }
}
