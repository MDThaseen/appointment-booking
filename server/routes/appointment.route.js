import express from "express";

import {
  createAppointment,
  getAppointments,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// get appointments
router.get("/", getAppointments);

// create appointment
router.post("/", createAppointment);

// mark appointment completed
router.patch("/:id/complete", completeAppointment);

// cancel appointment
router.patch("/:id/cancel", cancelAppointment);

// delete appointment
router.delete("/:id", deleteAppointment);

export default router;