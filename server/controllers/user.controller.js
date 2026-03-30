import UserService from "../services/user.service.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async createMessage(req, res, next) {
    try {
      const data = req.body;
      const result = await this.userService.createMessage(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const userId = "69ca77361bd7e5b103b9730d";
      const { contactId } = req.params;
      const result = await this.userService.getMessages(userId, contactId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
