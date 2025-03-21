import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({
    title: "GET ALL SUBSCRIPTIONS",
  });
});
// subscriptionRouter.get("/:id", author);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.put("/:id", (req, res) => {
  res.send({
    title: "update subscription",
  });
});
subscriptionRouter.delete("/:id", (req, res) => {
  res.send({
    title: "delete  SUBSCRIPTIONS ",
  });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({
    title: "cancel subscription ",
  });
});
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({
    title: "get upcoming renewals  ",
  });
});
export default subscriptionRouter;
