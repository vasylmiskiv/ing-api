import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

import { AuthUserDto } from "../dto/AuthUser.dto.js";
import { RegisterUserDto } from "../dto/RegisterUser.dto.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getUsers = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    let users;

    const user = await this.userService.findUserById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

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

    const userToPromote = await this.userService.findUserById(boss);
    if (!userToPromote) {
      res.status(400);
      throw new Error("Boss not found");
    }

    const createdUser = await this.userService.createUser(registerUserDto);
    if (createdUser) {
      if (
        createdUser.role === "Regular User" &&
        userToPromote.role !== "Administrator" &&
        userToPromote._id.toString() === createdUser.boss.toString()
      ) {
        await this.userService.promoteUserAndGetSubs(
          userToPromote,
          createdUser._id
        );
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

  changeUserBoss = asyncHandler(async (req, res) => {
    const { _id: currentBossId } = req.user;
    const { id: userId } = req.params;
    const { nextBossId } = req.body;

    const currentBoss = await this.userService.findUserById(currentBossId);
    const user = await this.userService.findUserById(userId);
    const nextBoss = await this.userService.findUserById(nextBossId);

    if (currentBoss.role !== "Boss") {
      return res
        .status(403)
        .json({ message: "You dont have access rights to change user role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!nextBoss) {
      return res.status(404).json({ message: "Next boss not found" });
    }

    if (!currentBoss.subordinates.includes(userId)) {
      return res
        .status(403)
        .json({ message: `The ${user.name} is not your subordinate` });
    }

    await this.userService.removeSubordinates(currentBoss, userId);
    await this.userService.addSubordinates(nextBoss, userId);
    await this.userService.changeUserBoss(user, nextBossId);

    res
      .status(200)
      .json({ message: "User's boss has been changed successfully" });
  });
}

export default UserController;
