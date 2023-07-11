import express from "express";

import UserRepository from "../repository/userRepository.js";
import UserService from "../services/userService.js";
import UserController from "../controllers/userController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

class UserRoutes {
  constructor() {
    this.router = express.Router();

    this.userRepository = new UserRepository();
    this.userService = new UserService(this.userRepository);
    this.userController = new UserController(this.userService);
    this.authMiddleware = new AuthMiddleware(this.userService);

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      this.authMiddleware.protect,
      this.userController.getUsers
    );
    this.router.post("/register", this.userController.registerUser);
    this.router.post("/auth", this.userController.authUser);
    this.router.put(
      "/edit/:id",
      this.authMiddleware.protect,
      this.userController.changeUserBoss
    );
  }

  getRouter() {
    return this.router;
  }
}

export default UserRoutes;
