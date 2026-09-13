import express from "express";
import { createAppointmentSummary } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/summary", createAppointmentSummary);

export default router;