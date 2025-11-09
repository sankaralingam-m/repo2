import express from "express";
import { getTrialsData } from "../controllers/trialsController.js";

const router = express.Router();
router.get("/:drug", getTrialsData);
export default router;
