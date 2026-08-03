import express from "express";
import { getAcademics } from "../controllers/academicsController.js";

const router = express.Router();

router.get("/", getAcademics);

export default router;