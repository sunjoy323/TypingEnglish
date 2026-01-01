import { handleSettings } from "../../server/api.js";

export async function onRequest(context) {
  return handleSettings(context.request, context.env);
}

