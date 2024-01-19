
import ProductRepository from "./product.repository.js";
import CartRepository from './cart.repository.js';
import UserRepository from './user.repository.js';
import { Products, Carts, Users} from '../dao/factory.js'

export const ProductService = new ProductRepository(new Products())
export const CartService = new CartRepository(new Carts())
export const UserService = new UserRepository(new Users())