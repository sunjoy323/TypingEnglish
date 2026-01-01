import { handleLogin } from "../../server/api.js";

export async function onRequest(context) {
  return handleLogin(context.request, context.env);
}

