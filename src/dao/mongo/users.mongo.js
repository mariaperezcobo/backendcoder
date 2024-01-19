import UserRegisterModel from "../models/userregister.model.js";

export default class Users {
    getUsers = async (username, id )=> { return UserRegisterModel.findOne(({email: username}), id).lean().exec() }
    addUsers = async newUser => { return UserRegisterModel.create(newUser) }
}



// import ProductsModel from "../models/prodmongoose.models.js"

// export default class Products {
//     getProducts = async () => { return ProductsModel.find() }
//     getProductsPaginate = async (searchQuery, options) => {
//         return ProductsModel.paginate(searchQuery, options);
//     }
//     getProductsById = async id => { const product = await ProductsModel.findById(id);
//         return product ? product.toObject() : null; }

//     deleteProduct = async id =>{return ProductsModel.deleteOne({ _id: id})}    
//     getProductsFindOne = async code => { return ProductsModel.findOne(code) }
//     addProduct = async product => { return ProductsModel.create(product) }
//     // updateOrder = async (id, order) => {
//     //     return OrderModel.updateOne({ _id: id }, { $set: order })
//     // }
// }