export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
        console.log('this.dao:', this.dao);
    }

    getProducts = async () => { return this.dao.getProducts() }
    getProductsById = async id => { return this.dao.getProductsById(id) }

    getProductsPaginate = async () => {
        return this.dao.getProductsPaginate()}
    
   // getProductsFindOne = async code => { return this.dao.getProductsfindOne(code) }
    deleteProduct = async id =>{return this.dao.deleteProduct(id)}  
    addProduct = async () => { return this.dao.addProduct() }
}
