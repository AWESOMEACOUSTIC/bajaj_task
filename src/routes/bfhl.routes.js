import { Router } from "express";
import { processBfhl, getOperation, health } from "../controllers/bfhl.controller.js";

const router = Router();

router.post("/bfhl", processBfhl);
router.get("/bfhl", getOperation);
router.get("/health", health);
router.get("/", (_req, res) => res.send("OK"));

export default router;
