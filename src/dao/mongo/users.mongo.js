import UserRegisterModel from "../models/userregister.model.js";

export default class Users {
  getAllUsers = async () => {
    // return await UserRegisterModel.find();

    try {
      const users = await UserRegisterModel.find().lean();
      //console.log("Users found:", users);
      return users;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error; // Lanza el error para que se maneje en el controlador
    }
  };

  getAllUsersForDate = async () => {
    // return await UserRegisterModel.find();

    try {
      const users = await UserRegisterModel.find();
      console.log("Users found:", users);
      return users;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error; // Lanza el error para que se maneje en el controlador
    }
  };

  getUsers = async (username, id) => {
    return await UserRegisterModel.findOne({ email: username }, id)
      .lean()
      .exec();
  };
  getUsersByEmail = async (email, id) => {
    return await UserRegisterModel.findOne({ email }, id).lean().exec();
  };
  getUsersById = async (id) => {
    return await UserRegisterModel.findOne(id).lean().exec();
  };

  addUsers = async (newUser) => {
    try {
      const result = await UserRegisterModel.create(newUser);
      return result;
    } catch (error) {
      console.error("Error en addUsers:", error);
      throw error;
    }
  };

  updateUser = async (cid, update) => {
    try {
      const updatedUser = await UserRegisterModel.findByIdAndUpdate(
        cid,
        update
      );
      return updatedUser;
    } catch (error) {
      console.error("Error en updateCart:", error);
      throw error;
    }
  };

  deleteUser = async (id) => {
    return UserRegisterModel.deleteOne({ _id: id });
  };
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
