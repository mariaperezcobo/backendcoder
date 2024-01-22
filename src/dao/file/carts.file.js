import FileManager from "./file.manager.js";
import __dirname from '../../utils.js'

export default class Carts extends FileManager {

    constructor(filename = __dirname + '/dao/files/carts.json') {
        super(filename)
    }

    getCarts = async () => { return this.get() }

    getCartsById = async (id) => {
        try {
            console.log('Obteniendo carrito por ID:', id);
            return this.getById(id);

        } catch (error) {
           
            console.error('Error en el método getcartById:', error);
            throw error;
        }
    };

    addCart = async (cart) => {
        try {
         
            return this.addCartFile(cart);
          
        } catch (error) {
           
            console.error('Error al agregar carrito', error);
            throw error;
        }
    };
   
    updateCart = async (id, update) => {
        try {
         
            return this.updateCartFile(id, update);
          
        } catch (error) {
           
            console.error('Error al agregar carrito', error);
            throw error;
        }
    };
}