import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

class AuthMiddleware {
  constructor(userService) {
    this.userService = userService;
  }

  protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await this.userService.findUserById(decoded.userId);

        req.user = await next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });

  permissions = asyncHandler(async (req, res, next) => {
    const user = this.userService.findUserById(req.body.bossId);

    if (user.role === "Regular User") {
      return res
        .status(403)
        .json({ message: "You dont have access rights to edit users" });
    }

    next();
  });
}

export default AuthMiddleware;
