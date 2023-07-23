import asyncHandler from "express-async-handler";

class AuthMiddleware {
  constructor(userService, tokenUtils) {
    this.userService = userService;
    this.tokenUtils = tokenUtils;
  }

  protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
      try {
        const decoded = this.tokenUtils.jwtVerify(token);

        const user = await this.userService.findUserById(decoded.userId);

        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });
}

export default AuthMiddleware;
