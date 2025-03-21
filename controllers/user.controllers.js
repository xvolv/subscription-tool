import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
export const getUsers = async (req, res, next) => {
  // token verification
  try {
    const users = await User.find({});
    if (!users) {
      const error = new Error("no users found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "list of users",
      data: {
        users: users,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getUserDetail = async (req, res, next) => {
  // token verification
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error("no user found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "list of users",
      data: {
        users: user,
      },
    });
  } catch (error) {
    next(error);
  }
};
