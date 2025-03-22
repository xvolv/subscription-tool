import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model";
import dayjs from "dayjs";

/**
 * Sends reminders for subscription renewals based on specified intervals.
 * @param {object} context - The context object containing request payload and logging capabilities.
 */
export const sendReminder = serve(async (context) => {
  const REMINDERS = [7, 5, 2, 1];
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);
  const today = dayjs();

  if (renewalDate.isBefore(today)) {
    console.log("Renewal date has passed.");
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(today)) {
      await sleepUntilReminder(context, `Reminder: ${daysBefore} days before`, reminderDate);
    }
    await triggerReminder(context, `Reminder: ${daysBefore} days before`);
  }
});

/**
 * Fetches the subscription details from the database.
 * @param {object} context - The context object for logging and execution.
 * @param {string} subscriptionId - The ID of the subscription to fetch.
 * @returns {object} The subscription details.
 */
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

/**
 * Sleeps until the specified reminder date.
 * @param {object} context - The context object for execution.
 * @param {string} label - The label for the sleep operation.
 * @param {dayjs} date - The date to sleep until.
 */
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${date.format("YYYY-MM-DD")}`);
  await context.sleepUntil(label, date.toDate());
};

/**
 * Triggers the reminder action.
 * @param {object} context - The context object for execution.
 * @param {string} label - The label for the reminder.
 */
const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder.`);
    // Here you can add logic to send email, SMS, or push notifications.
  });
};