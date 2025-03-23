import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    // Check for existing active workflow runs
    const hasActiveWorkflow = subscription.workflowRuns.some(
      (run) => run.status === "active"
    );

    if (!hasActiveWorkflow) {
      const workflowResponse = await workflowClient.trigger({
        url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
        body: {
          subscriptionId: subscription.id,
        },
        headers: {
          "Content-Type": "application/json",
        },
        retries: 0,
      });

      // Add the new workflow run to the subscription
      subscription.workflowRuns.push({
        workflowRunId: workflowResponse.workflowRunId,
        status: "active",
      });
      await subscription.save();

      console.log(
        "Workflow triggered successfully:",
        workflowResponse.workflowRunId
      );
    } else {
      console.log("Active workflow already exists for this subscription");
    }

    res.status(201).json({
      success: true,
      data: subscription,
      workflowRunId:
        subscription.workflowRuns[subscription.workflowRuns.length - 1]
          ?.workflowRunId,
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
