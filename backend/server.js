import express from "express";
import cors from "cors";

// Import all route files
import trialsRoutes from "./routes/trials.js";
import patentsRoutes from "./routes/patents.js";
import pubmedRoutes from "./routes/pubmed.js";
import europepmcRoutes from "./routes/europepmc.js";


const app = express();

app.use(cors());
app.use(express.json());

// Connect routes
app.use("/api/research/trials", trialsRoutes);
app.use("/api/research/patents", patentsRoutes);
app.use("/api/research/pubmed", pubmedRoutes);
app.use("/api/research/europepmc", europepmcRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
