import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// __dirname setup (since we are in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API route (test)
app.get("/api", (req, res) => {
  res.send("Backend API is working ✅ with ESM");
});

// Serve frontend build (for production)
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
