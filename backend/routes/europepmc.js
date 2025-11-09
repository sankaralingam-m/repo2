
import express from "express";
import { getEuropePMC } from "../controllers/europepmcController.js";

const router = express.Router();
router.get("/:drug", getEuropePMC);
export default router;
