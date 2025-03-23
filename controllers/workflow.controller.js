import dayjs from "dayjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  console.log("Starting reminder workflow");
  const { subscriptionId } = context.requestPayload;
  console.log(`Processing subscription ID: ${subscriptionId}`);

  const subscription = await fetchSubscription(context, subscriptionId);
  console.log(`Fetched subscription: ${subscription?.name || "Not found"}`);

  if (!subscription || subscription.status !== "active") {
    console.log(
      `Skipping inactive or non-existent subscription: ${subscriptionId}`
    );
    return;
  }

  try {
    const renewalDate = dayjs(subscription.renewalDate);
    console.log(`Renewal date: ${renewalDate.format("YYYY-MM-DD")}`);

    if (renewalDate.isBefore(dayjs())) {
      console.log(
        `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`
      );
      return;
    }

    for (const daysBefore of REMINDERS) {
      const reminderDate = renewalDate.subtract(daysBefore, "day");
      console.log(
        `Processing reminder for ${daysBefore} days before renewal. Reminder date: ${reminderDate.format(
          "YYYY-MM-DD"
        )}`
      );

      if (reminderDate.isAfter(dayjs())) {
        console.log(
          `Setting up sleep until reminder for ${daysBefore} days before`
        );
        await sleepUntilReminder(
          context,
          `Reminder ${daysBefore} days before`,
          reminderDate
        );
      }

      // Check if we're within the same day (using startOf('day') for more reliable comparison)
      if (dayjs().startOf("day").isSame(reminderDate.startOf("day"))) {
        console.log(
          `Current date matches reminder date for ${daysBefore} days before`
        );
        await triggerReminder(
          context,
          `${daysBefore} days before reminder`,
          subscription
        );
      } else {
        console.log(
          `Current date (${dayjs().format(
            "YYYY-MM-DD"
          )}) does not match reminder date (${reminderDate.format("YYYY-MM-DD")})`
        );
      }
    }

    // Update workflow status to completed
    const workflowRunId = context.workflowRunId;
    await updateWorkflowStatus(subscriptionId, workflowRunId, 'completed');
  } catch (error) {
    // Update workflow status to failed
    const workflowRunId = context.workflowRunId;
    await updateWorkflowStatus(subscriptionId, workflowRunId, 'failed');
    throw error;
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    console.log(`Fetching subscription with ID: ${subscriptionId}`);
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(
    `Sleeping until ${label} reminder at ${date.format("YYYY-MM-DD HH:mm:ss")}`
  );
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(
      `Triggering ${label} reminder for subscription: ${subscription.name}`
    );
    console.log(`Sending to user: ${subscription.user.email}`);

    try {
      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
      });
      console.log(`Successfully triggered ${label} reminder`);
    } catch (error) {
      console.error(`Failed to trigger ${label} reminder:`, error);
      throw error;
    }
  });
};

const updateWorkflowStatus = async (subscriptionId, workflowRunId, status) => {
  await Subscription.updateOne(
    { 
      _id: subscriptionId,
      'workflowRuns.workflowRunId': workflowRunId 
    },
    { 
      $set: { 'workflowRuns.$.status': status }
    }
  );
};
