
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/research/trials", trialsRoutes);
app.use("/api/research/patents", patentsRoutes);
app.use("/api/research/pubmed", pubmedRoutes);
app.use("/api/research/europepmc", europepmcRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
