export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createUser = async () => {
    return this.dao.createUser();
  };

  getAllUsers = async () => {
    return this.dao.getAllUsers();
  };
  getAllUsersForDate = async () => {
    return this.dao.getAllUsersForDate();
  };
  getUsers = async (username) => {
    return this.dao.getUsers(username);
  };

  getUsersById = async (id) => {
    return this.dao.getUsersById(id);
  };

  getUsersByEmail = async (username) => {
    return this.dao.getUsersByEmail(username);
  };
  addUsers = async (newUser) => {
    return this.dao.addUsers(newUser);
  };
  updateUser = async (cid, update) => {
    return this.dao.updateUser(cid, update);
  };
  deleteUser = async (id) => {
    return this.dao.deleteUser(id);
  };
}
