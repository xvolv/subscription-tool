import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import userRouter from "./routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleWare from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
const app = express();
app.get("/", (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    message: "message",
    data: "this is data",
  });
});
app.use(express.json());
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/users", userRouter);
app.use(errorMiddleWare);
app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
