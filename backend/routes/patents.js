import express from "express";
import { getPatents } from "../controllers/patentsController.js";

const router = express.Router();

// GET /api/patents?q=aspirin&year=2024&source=EP
router.get("/", getPatents);

export default router;
