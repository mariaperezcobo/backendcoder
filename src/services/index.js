
import ProductRepository from "./product.repository.js";
import CartRepository from './cart.repository.js';
import { Products, Carts} from '../dao/factory.js'

export const ProductService = new ProductRepository(new Products())
export const CartService = new CartRepository(new Carts())