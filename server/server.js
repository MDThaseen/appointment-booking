import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import supabase from "./config/supabase.js";
import appointmentRoutes from "./routes/appointment.route.js";
import aiRoutes from "./routes/ai.route.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Appointment Booking API is running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Supabase connection successful",
      data,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Supabase connection failed",
      error: error.message,
    });
  }
});

app.use("/api/appointments", appointmentRoutes);

app.use("/api/ai", aiRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});