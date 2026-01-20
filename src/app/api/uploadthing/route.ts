import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Fallback token if env var not set
if (!process.env.UPLOADTHING_TOKEN) {
  process.env.UPLOADTHING_TOKEN = "eyJhcGlLZXkiOiJza19saXZlXzU1ZTEyMTMxZDk4M2Y5OGM5ZTUzN2U2YTkxYmQ0ZmQzNzZiMGI3MTQ1ZjgwNDI3ZWY1ODYyNjEzNTUwZmFmZWIiLCJhcHBJZCI6Inc2enExbnl5MDEiLCJyZWdpb25zIjpbInNlYTEiXX0=";
}

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
