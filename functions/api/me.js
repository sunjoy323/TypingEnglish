import { handleMe } from "../../server/api.js";

export async function onRequest(context) {
  return handleMe(context.request, context.env);
}

