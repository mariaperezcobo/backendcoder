// import { User, Order, Store } from '../DAO/factory.js'

// import UserRepository from './user.repository.js'
// import StoreRepository from './store.repository.js'
// import OrderRepository from './order.repository.js'

// export const UserService = new UserRepository(new User())
// export const StoreService = new StoreRepository(new Store())
// export const OrderService = new OrderRepository(new Order())

//import Products from '../dao/mongo/products.mongo.js'
import ProductRepository from "./product.repository.js";
import CartRepository from './cart.repository.js';
import { Products, Carts} from '../dao/factory.js'

export const ProductService = new ProductRepository(new Products())
export const CartService = new CartRepository(new Carts())