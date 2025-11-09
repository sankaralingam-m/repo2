import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import trialsRoutes from "./routes/trials.js";
import patentsRoutes from "./routes/patents.js";
import pubmedRoutes from "./routes/pubmed.js";
import europepmcRoutes from "./routes/europepmc.js";

const app = express();
app.use(cors());
app.use(express.json());

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/research/trials", trialsRoutes);
app.use("/api/research/patents", patentsRoutes);
app.use("/api/research/pubmed", pubmedRoutes);
app.use("/api/research/europepmc", europepmcRoutes);

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Use Render PORT or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start server and add timeouts
const server = app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on port ${PORT}`)
);

// Increase timeouts to prevent Render worker issues
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;   // 120 seconds
