import express from "express";

import UserRepository from "../repository/userRepository.js";
import UserService from "../services/userService.js";
import UserController from "../controllers/userController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const authMiddleware = new AuthMiddleware(userService);

router.get("/", authMiddleware.protect, userController.getUsers);
router.post("/register", userController.registerUser);
router.post("/auth", userController.authUser);
router.put(
  "/edit/:id",
  authMiddleware.protect,
  authMiddleware.permissions,
  userController.changeUserBoss
);
router.post("/logout", userController.logoutUser);

export default router;
