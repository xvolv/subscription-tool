import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error("error in the db uri");
}

//
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`database connected successfuly in a  ${NODE_ENV} mode`);
  } catch (error) {
    console.log(error, "error connecting to the database");
    process.exit(1);
  }
};

export default connectToDatabase;
