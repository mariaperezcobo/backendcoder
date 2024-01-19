import FileManager from "./file.manager.js";
import __dirname from '../../utils.js'

export default class Carts extends FileManager {

    constructor(filename = __dirname + '/dao/files/products.json') {
        super(filename)
    }

   
}