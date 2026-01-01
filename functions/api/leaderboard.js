import { handleLeaderboard } from "../../server/api.js";

export async function onRequest(context) {
  return handleLeaderboard(context.request, context.env);
}

