import express from "express";

import UserRepository from "../repository/userRepository.js";
import UserService from "../services/userService.js";
import UserController from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/", protect, userController.getUsers);
router.post("/register", userController.registerUser);
router.post("/auth", userController.authUser);
router.post("/change/:id", protect, userController.changeUserBoss);
router.post("/logout", userController.logoutUser);

router
  .route("/profile")
  // .get(protect, userController.getUserProfile)
  .patch(protect, userController.updateUserProfile);

export default router;
