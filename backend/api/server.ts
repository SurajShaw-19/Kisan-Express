import express from "express";
import weatherRoute from "./weatherRoute.js";
import cropSuggestRoute from "./cropSuggestRoute.js";

export function createServer() {
  const app = express();
  app.use(express.json());

  // ✅ Mount routes
  app.use("/weather", weatherRoute);
  app.use("/crop-suggest", cropSuggestRoute);

  return app;
}
