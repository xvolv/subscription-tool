import Subscription from "../models/subscription.model.js";
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      data: subscription,
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
