import { handleApiRequest } from "../server/api.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return handleApiRequest(request, env);
    }

    if (url.pathname === "/github.html") {
      url.pathname = "/Github.html";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/Typegame1.html") {
      url.pathname = "/index.html";
      return Response.redirect(url.toString(), 301);
    }

    if ((request.method === "GET" || request.method === "HEAD") && url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }

    return env.ASSETS.fetch(request);
  },
};
