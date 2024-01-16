export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => { return this.dao.getProducts() }
    getProductsById = async id => { return this.dao.getProductsById(id) }
    getProductsPaginate = async () => { return this.dao.getProductsPaginate() }
    getProductsFindOne = async code => { return this.dao.getProductsfindOne(code) }
}