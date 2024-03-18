export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAllUsers = async () => {
    return this.dao.getAllUsers();
  };
  getUsers = async (username) => {
    return this.dao.getUsers(username);
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
}
