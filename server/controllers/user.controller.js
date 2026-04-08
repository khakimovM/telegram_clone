import UserService from "../services/user.service.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // GET
  async getMessages(req, res, next) {
    try {
      const userId = req.user._id;
      const { contactId } = req.params;
      const result = await this.userService.getMessages(userId, contactId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await this.userService.getContacts(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST
  async createMessage(req, res, next) {
    try {
      const data = req.body;
      const result = await this.userService.createMessage(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createContact(req, res, next) {
    try {
      const userId = req.user._id;
      const { email } = req.body;

      const result = await this.userService.createContact(userId, email);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createReaction(req, res, next) {
    try {
      const { messageId, reaction } = req.body;
      const result = await this.userService.createReaction(messageId, reaction);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;

      const result = await this.userService.sendOtp(email);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async messageRead(req, res, next) {
    try {
      const { messages } = req.body;
      const result = await this.userService.messageRead(messages);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // PUT
  async updateMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const { text } = req.body;

      const result = await this.userService.updateMessage(messageId, text);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = req.user;

      const payload = req.body;

      const result = await this.userService.updateProfile(user._id, payload);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateEmail(req, res, next) {
    try {
      const userId = req.user._id;
      const { email, otp } = req.body;

      const result = await this.userService.updateEmail(userId, email, otp);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const result = await this.userService.deleteMessage(messageId);
      console.log(result);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await this.userService.deleteUser(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
