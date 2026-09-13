import { generateAppointmentSummary } from "../utils/aiSummary.util.js";

export const createAppointmentSummary = async (req, res) => {
  try {
    const { reason } = req.body || {};

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reason for visit is required",
      });
    }

    const summary = await generateAppointmentSummary(reason);

    return res.status(200).json({
      success: true,
      message: "Appointment summary generated successfully",
      data: {
        summary,
      },
    });
  }
  //   catch (error) {
  //     console.error("AI summary error:", error);

  //     return res.status(503).json({
  //       success: false,
  //       message:
  //         "AI service is temporarily unavailable. Please try again later.",
  //     });
  //   }
  // };

  catch (error) {
    console.error("AI summary error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "AI request failed",
    });
  }
};