export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
       // console.log('this.dao:', this.dao);
    }

    getProducts = async () => { return this.dao.getProducts() }
    getProductsById = async id => { 
        console.log('ProductService - getProductsById - id:', id);
        return this.dao.getProductsById(id) }

    getProductsPaginate = async (searchQuery, options) => {
        return this.dao.getProductsPaginate(searchQuery, options)}
    
   // getProductsFindOne = async code => { return this.dao.getProductsfindOne(code) }
    deleteProduct = async id =>{return this.dao.deleteProduct(id)}  
    //addProduct = async (productToInsert) => { return this.dao.addProduct(productToInsert) }
    addProduct = async (productmongooseNew) => { return this.dao.addProduct(productmongooseNew) }
}
