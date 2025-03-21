import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Unauthorized access");
      error.statusCode = 401;
      throw error;
    }

    // jwt.verify() will throw an error if the token is invalid
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new Error("Unauthorized access");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next(); // Proceed to the next middleware
  } catch (error) {
    next(error);
  }
};

export default authorize;
