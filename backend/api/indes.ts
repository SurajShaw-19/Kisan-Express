import { createServer } from "./server.js";
import dotenv from "dotenv";

dotenv.config(); // load .env

const PORT = process.env.PORT || 5000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
