import { useState } from "react";
import { toast } from "react-toastify";
import { createAppointment } from "../services/appointmentService";
import { generateAppointmentSummary } from "../services/aiService";

const AppointmentForm = ({ onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    patient_name: "",
    mobile_number: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers for mobile number
    if (name === "mobile_number" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts correcting it
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const patientName = formData.patient_name.trim();
    const mobileNumber = formData.mobile_number.trim();
    const doctorName = formData.doctor_name.trim();

    if (!patientName) {
      newErrors.patient_name = "Patient name is required";
    } else if (patientName.length < 2) {
      newErrors.patient_name =
        "Patient name must contain at least 2 characters";
    }

    if (!mobileNumber) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      newErrors.mobile_number =
        "Enter a valid 10-digit mobile number";
    }

    if (!doctorName) {
      newErrors.doctor_name = "Doctor name is required";
    } else if (doctorName.length < 2) {
      newErrors.doctor_name =
        "Doctor name must contain at least 2 characters";
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date =
        "Appointment date is required";
    } else if (formData.appointment_date < today) {
      newErrors.appointment_date =
        "Appointment date cannot be in the past";
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time =
        "Appointment time is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      const response = await createAppointment({
        ...formData,
        patient_name: formData.patient_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        doctor_name: formData.doctor_name.trim(),
      });

      if (onAppointmentCreated) {
        onAppointmentCreated(response.data);
      }

      setFormData({
        patient_name: "",
        mobile_number: "",
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
      });

      setErrors({});

      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Create appointment error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to book appointment. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!reason.trim()) {
      toast.error("Please enter the reason for the visit");
      return;
    }

    try {
      setAiLoading(true);

      const response = await generateAppointmentSummary(reason);

      setAiSummary(response.data.summary);

      toast.success("AI summary generated");
    } catch (error) {
      console.error("AI summary error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to generate AI summary"
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>

      <form onSubmit={handleSubmit}>
        {/* Patient Name */}
        <div className="form-group">
          <label htmlFor="patient_name">
            Patient Name
          </label>

          <input
            type="text"
            id="patient_name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            placeholder="Enter patient name"
            className={errors.patient_name ? "input-error" : ""}
          />

          {errors.patient_name && (
            <span className="field-error">
              {errors.patient_name}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div className="form-group">
          <label htmlFor="mobile_number">
            Mobile Number
          </label>

          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            inputMode="numeric"
            className={errors.mobile_number ? "input-error" : ""}
          />

          {errors.mobile_number && (
            <span className="field-error">
              {errors.mobile_number}
            </span>
          )}
        </div>

        {/* Doctor Name */}
        <div className="form-group">
          <label htmlFor="doctor_name">
            Doctor Name
          </label>

          <input
            type="text"
            id="doctor_name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            placeholder="Enter doctor name"
            className={errors.doctor_name ? "input-error" : ""}
          />

          {errors.doctor_name && (
            <span className="field-error">
              {errors.doctor_name}
            </span>
          )}
        </div>

        {/* Appointment Date */}
        <div className="form-group">
          <label htmlFor="appointment_date">
            Appointment Date
          </label>

          <input
            type="date"
            id="appointment_date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            min={today}
            className={
              errors.appointment_date ? "input-error" : ""
            }
          />

          {errors.appointment_date && (
            <span className="field-error">
              {errors.appointment_date}
            </span>
          )}
        </div>

        {/* Appointment Time */}
        <div className="form-group">
          <label htmlFor="appointment_time">
            Appointment Time
          </label>

          <input
            type="time"
            id="appointment_time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            className={
              errors.appointment_time ? "input-error" : ""
            }
          />

          {errors.appointment_time && (
            <span className="field-error">
              {errors.appointment_time}
            </span>
          )}
        </div>

        {/* Reason for Visit */}

        <div className="form-group reason-group">
          <label htmlFor="reason">Reason for Visit</label>

          <textarea
            id="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setAiSummary("");
            }}
            placeholder="Briefly describe the reason for the appointment..."
            rows="4"
          />

          <button
            type="button"
            className="ai-button"
            onClick={handleGenerateSummary}
            disabled={aiLoading || !reason.trim()}
          >
            {aiLoading ? "Generating..." : "✨ Generate AI Summary"}
          </button>

          {aiSummary && (
            <div className="ai-summary">
              <strong>AI Summary</strong>
              <p>{aiSummary}</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;