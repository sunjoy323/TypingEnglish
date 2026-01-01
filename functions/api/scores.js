import { handleScores } from "../../server/api.js";

export async function onRequest(context) {
  return handleScores(context.request, context.env);
}

