import express from "express";
import weatherRoute from "./weatherRoute.js";
import cropSuggestRoute from "./cropSuggestRoute.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Mount routes
  app.use("/weather", weatherRoute);
  app.use("/crop-suggest", cropSuggestRoute);

  // Test route
  app.get("/", (req, res) => {
    res.send("Backend is working ✅");
  });

  return app;
}

// If this file is run directly, start the server
if (process.argv[1].includes("server.ts") || process.argv[1].includes("server.js")) {
  const PORT = process.env.PORT || 5000;
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
