import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

import { AuthUserDto } from "../dto/AuthUser.dto.js";
import { RegisterUserDto } from "../dto/RegisterUser.dto.js";
import { UpdateUserDto } from "../dto/UpdateUser.dto.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUsers = asyncHandler(async (req, res) => {
    const { _id: userId } = req.body;

    let users;

    const user = await this.userService.findUserById(userId);

    switch (user.role) {
      case "Administrator":
        users = await this.userService.getUsers();
        break;
      case "Boss": {
        const subordinates = await this.userService.getSubordinates(userId);

        users = [user, ...subordinates];
        break;
      }
      default:
        users = user;
        break;
    }

    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404);
      throw new Error("Users not found");
    }
  });

  authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const authUserDto = new AuthUserDto(email, password);

    const user = await this.userService.authUser(authUserDto);

    if (user) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        role: user.role,
        boss: user.boss,
        subordinates: user.subordinates,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  });

  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, boss } = req.body;

    const registerUserDto = new RegisterUserDto(
      name,
      email,
      password,
      role,
      boss
    );

    if (role === "Administrator") {
      const isAdminExistsOne = await this.userService.isAdminExists();

      if (isAdminExistsOne) {
        res.status(400);
        throw new Error("Administrator already exists");
      }
    }

    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const createdUser = await this.userService.createUser(registerUserDto);
    if (createdUser) {
      if (boss) {
        const userToPromote = await this.userService.findUserById(boss);

        if (
          userToPromote.role === "Regular User" ||
          userToPromote._id.toString() === createdUser.boss.toString()
        ) {
          await this.userService.promoteUserAndGetSubs(
            userToPromote,
            createdUser._id
          );
        }
      }

      generateToken(res, createdUser._id);

      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        boss: createdUser.boss,
        subordinates: createdUser.subordinates,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });

  logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "User logged out" });
  });

  // getUserProfile = asyncHandler(async (req, res) => {
  //   const user = await this.userService.findUserById(req.user._id);

  //   if (user) {
  //     res.status(200).json({
  //       _id: req.user._id,
  //       name: req.user.name,
  //       email: req.user.email,
  //     });
  //   } else {
  //     res.status(404);
  //     throw new Error("User not found");
  //   }
  // });

  updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const updateUserDto = new UpdateUserDto(name, email, password);

    const user = await this.userService.findUserById(req.body._id);

    if (user) {
      const updatedUser = await this.userService.updateUser(
        user,
        updateUserDto
      );

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });
}

export default UserController;
