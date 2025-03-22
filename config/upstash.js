import { Client as workflowClientConfig } from "@upstash/workflow";

import { QSTASH_TOKEN, QSTASH_URL } from "./env.js";

export const workflowClient = new workflowClientConfig({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});
