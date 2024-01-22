import UserRegisterModel from "../models/userregister.model.js";

export default class Users {

    getUsers = async (username, id )=> { return await UserRegisterModel.findOne(({email: username}), id).lean().exec() }
    getUsersByEmail = async (username, id )=> { return await UserRegisterModel.findOne(({email}), id).lean().exec() }
    addUsers = async newUser => { 
        try {
            const result = await UserRegisterModel.create(newUser);
            return result; 
        } catch (error) {
            console.error('Error en addUsers:', error);
            throw error;
        }
    }
        
       

    updateUser= async (cid, update) =>{try {
        const updatedUser = await UserRegisterModel.findByIdAndUpdate(cid, update);
        return updatedUser;
    } catch (error) {
        console.error('Error en updateCart:', error);
        throw error;
    }}    
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