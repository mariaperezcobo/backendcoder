import mongoose from "mongoose";

import environmentConfig from '../enviroments.js'

export let Products
export let Carts

console.log(`Persistence with ${environmentConfig.PERSISTENCE}`)

switch (environmentConfig.PERSISTENCE) {
    case "MONGO":

        await mongoose.connect(environmentConfig.MONGO_URL, { dbName: environmentConfig.MONGO_DBNAME })
        console.log('DB connected 👌')

        const { default: ProductsMongo } = await import('../dao/mongo/products.mongo.js')
        const { default: CartsMongo } = await import('../dao/mongo/carts.mongo.js')

        Products = ProductsMongo
        Carts = CartsMongo

        break;

    case "FILE":

    const { default: ProductsFile } = await import('../dao/file/products.file.js')
        

    Products = ProductsFile

        break

    default:
        throw new Error('Persistence not recognized')
}
