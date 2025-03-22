import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    console.log(subscription._id + "----" + subscription.id);
    const idontknowwhatthisis = await workflowClient.trigger({
      // url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
      retries: 0,
    });
    const url = `${SERVER_URL}/api/v1/workflows/subscription/reminder`;
    console.log(idontknowwhatthisis, "this this this");
    console.log("Workflow triggered successfully");
    console.log("this is the url", url);

    res.status(201).json({
      success: true,
      data: subscription,
      workflowRunId: idontknowwhatthisis.workflowRunId,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  if (req.params.id.toString() !== req.user._id.toString()) {
    const error = new Error(
      "you can only got your own subscription with what you are logged in"
    );
    error.statusCode = 400;
    throw error;
  }
  try {
    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: subscriptions,
      name: req.user.name,
    });
  } catch (error) {
    next(error);
  }
};
