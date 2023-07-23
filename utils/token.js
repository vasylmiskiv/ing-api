import jwt from "jsonwebtoken";

class TokenUtils {
  jwtVerify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  generateToken(res, userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}

export default TokenUtils;
