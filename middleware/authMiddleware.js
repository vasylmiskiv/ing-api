import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

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

        const user = await this.userService.findUserById(decoded.userId);

        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
}

export default AuthMiddleware;
