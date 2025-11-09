import express from "express";
import { getPubMed } from "../controllers/pubmedController.js";

const router = express.Router();
router.get("/:drug", getPubMed);
export default router;
