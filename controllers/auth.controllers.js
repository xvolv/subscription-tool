import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //  check if the user already exist
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("user already exit , please login");
      error.statusCode = 409;
      throw error;
    }
    //
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "user created succsesfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    //
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("provide both email and password");
      error.statuCode = 400;
      throw error;
    }
    const user = await User.findOne({ email }).select("+password");
    //check if user exist
    if (!user) {
      const error = new Error("email not found , signup and try login again");
      error.statusCode = 404;
      throw error;
    }
    //check weather password is match or not
    const passwordCheck = await bcrypt.compare(password, user.password);
    console.log("the password check --", passwordCheck);
    if (!passwordCheck) {
      const error = new Error(
        "wrong password , check your password and try login again"
      );
      error.statusCode = 401;
      throw error;
    }
    //generate token and sent
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      success: true,
      message: "user sign in successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
// export const signOut = async (req, res, next) => {};
