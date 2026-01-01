import { handleRegister } from "../../server/api.js";

export async function onRequest(context) {
  return handleRegister(context.request, context.env);
}

