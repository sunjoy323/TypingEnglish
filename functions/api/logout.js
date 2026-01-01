import { handleLogout } from "../../server/api.js";

export async function onRequest(context) {
  return handleLogout(context.request, context.env);
}

