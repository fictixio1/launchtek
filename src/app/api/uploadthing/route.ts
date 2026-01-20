import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN || "eyJhcGlLZXkiOiJza19saXZlXzU1ZTEyMTMxZDk4M2Y5OGM5ZTUzN2U2YTkxYmQ0ZmQzNzZiMGI3MTQ1ZjgwNDI3ZWY1ODYyNjEzNTUwZmFmZWIiLCJhcHBJZCI6Inc2enExbnl5MDEiLCJyZWdpb25zIjpbInNlYTEiXX0=",
  },
});
