import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "USER NAME IS REQUIRED"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: [true, "email alread exist"],
      required: [true, "USER EMAIL IS REQUIRED"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "PLEASE FILL A VALID EMAIL ADDRESS",
      ],
    },
    password: {
      type: String,
      required: [true, "USER EMAIL IS REQUIRED"],
      minLength: 6,
      select: false,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;
