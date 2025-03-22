import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";

export const sendReminder = serve(async (context) => {
  console.log("sendReminder called");

  const REMINDERS = [7, 5, 2, 1];
  if (!context || !context.requestPayload) {
    console.error("context or context.requestPayload is undefined", context);
    return { error: "Invalid context" }; // Early return with a response
  }

  const { subscriptionId } = context.requestPayload;
  console.log("this is context payload--", context.requestPayload);

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") {
    console.log("Subscription not found or inactive");
    return { message: "No action needed" };
  }

  const renewalDate = dayjs(subscription.renewalDate);
  const today = dayjs();

  if (renewalDate.isBefore(today)) {
    console.log("Renewal date has passed.");
    return { message: "Renewal date passed" };
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(today)) {
      await sleepUntilReminder(
        context,
        `Reminder: ${daysBefore} days before`,
        reminderDate
      );
    }
    await triggerReminder(context, `Reminder: ${daysBefore} days before`);
  }

  console.log("sendReminder execution completed");
  return { message: "Reminders scheduled" };
});

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${date.format("YYYY-MM-DD")}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  await context.run(label, () => {
    console.log(`Triggering ${label} reminder.`);
    // Add notification logic here if needed
  });
};

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};
