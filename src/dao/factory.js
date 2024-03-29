import mongoose from "mongoose";

import environmentConfig from '../enviroments.js'
import {opts} from '../commander.js'


export let Products
export let Carts
export let Users
export let Tickets
export let Chats

console.log(`Persistence with ${environmentConfig.PERSISTENCE}`)
//console.log(`Persistence with ${environmentConfig.PERSISTENCE}`)

switch (environmentConfig.PERSISTENCE) {
    case "MONGO":

        await mongoose.connect(environmentConfig.MONGO_URL, { dbName: environmentConfig.MONGO_DBNAME })
        console.log('DB connected 👌')

        const { default: ProductsMongo } = await import('../dao/mongo/products.mongo.js')
        const { default: CartsMongo } = await import('../dao/mongo/carts.mongo.js')
        const { default: UsersMongo } = await import('../dao/mongo/users.mongo.js')
        const { default: TicketsMongo } = await import('../dao/mongo/tickets.mongo.js')
        const { default: ChatsMongo } = await import('../dao/mongo/chat.mongo.js')

        Products = ProductsMongo
        Carts = CartsMongo
        Users = UsersMongo
        Tickets = TicketsMongo
        Chats = ChatsMongo

        break;

    case "FILE":

    await mongoose.connect(environmentConfig.MONGO_URL, { dbName: environmentConfig.MONGO_DBNAME })
    console.log('DB connected 👌')

    const { default: ProductsFile } = await import('../dao/file/products.file.js')
    const { default: CartsFile } = await import('../dao/file/carts.file.js')
    const { default: UsersFile } = await import('../dao/file/users.file.js')
    const { default: TicketsFile } = await import('../dao/mongo/tickets.mongo.js')
    const { default: ChatsFile } = await import('../dao/mongo/chat.mongo.js')

    Products = ProductsFile
    Carts = CartsFile
    Users = UsersFile
    Tickets = TicketsFile
    Chats = ChatsFile

        break

    default:
        throw new Error('Persistence not recognized')
}
