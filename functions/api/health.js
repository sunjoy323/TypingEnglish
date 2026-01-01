import { handleHealth } from "../../server/api.js";

export async function onRequest(context) {
  return handleHealth(context.request, context.env);
}

