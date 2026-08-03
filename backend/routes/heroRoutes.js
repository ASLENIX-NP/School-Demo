import express from "express";
import { getHero } from "../controllers/heroController.js";

const router = express.Router();

router.get("/", getHero);

export default router;