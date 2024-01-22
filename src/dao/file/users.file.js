
import FileManager from "./file.manager.js";
import __dirname from '../../utils.js'

export default class Carts extends FileManager {

    constructor(filename = __dirname + '/dao/files/users.json') {
        super(filename)
    }

    getUsersByEmail = async () => { return this.getUserByEmailFile(username)}

    getUsers = async () => { return this.getUserByIdFile()}
   

    addUsers = async (user) => {
        try {
         
            return this.addUserFile(user);
          
        } catch (error) {
           
            console.error('Error ', error);
            throw error;
        }
    };


    updateUser = async (id, update) => {
        try {
            
            return this.updateUserFile(id, update);
          
        } catch (error) {
           
            console.error('Error al agregar carrito al usuario', error);
            throw error;
        }
    };
   
}