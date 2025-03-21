import { Router } from "express";
import autorize from "../middlewares/auth.middleware.js";
import { getUserDetail, getUsers } from "../controllers/user.controllers.js";
const userRouter = Router();

userRouter.get("/", autorize, getUsers);
userRouter.get("/:id", autorize, getUserDetail);

userRouter.post("/", (req, res) => {
  res.status(200).json({
    req: "create a new user",
  });
});
userRouter.put("/:id", (req, res) => {
  res.status(200).json({
    req: "update a user",
  });
});
userRouter.delete("/:id", (req, res) => {
  res.status(200).json({
    req: "delete a user",
  });
});

export default userRouter;
