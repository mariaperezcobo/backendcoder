
import ProductRepository from "./product.repository.js";
import CartRepository from './cart.repository.js';
import UserRepository from './user.repository.js';
import TicketRepository from "../services/ticket.repository.js";

import { Products, Carts, Users, Tickets} from '../dao/factory.js'

export const ProductService = new ProductRepository(new Products())
export const CartService = new CartRepository(new Carts())
export const UserService = new UserRepository(new Users())
export const TicketService = new TicketRepository(new Tickets())