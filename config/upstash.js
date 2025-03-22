// Importing the default export from @upstash/workflow
import { Client as workflowClient } from "@upstash/workflow";

// Importing environment variables
import { QSTASH_TOKEN, QSTASH_URL } from "./env.js";

// Initialize the WorkflowClient (if it's the default export)
export const client = new workflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});

export default client; // Export the client for use in other files
