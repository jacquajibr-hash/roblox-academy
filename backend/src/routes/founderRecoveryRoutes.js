
import express from "express";
import { recoverFounder } from "../controllers/founderRecoveryController.js";

const router = express.Router();

router.post("/", recoverFounder);

export default router;
