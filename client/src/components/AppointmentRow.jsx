import { useState } from "react";
import { toast } from "react-toastify";
import {
    completeAppointment,
    cancelAppointment,
    deleteAppointment,
} from "../services/appointmentService";

const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const AppointmentRow = ({
    appointment,
    onAppointmentDeleted,
    onStatusUpdated,
}) => {
    const [loadingAction, setLoadingAction] = useState("");

    const handleComplete = async () => {
        try {
            setLoadingAction("complete");

            const response = await completeAppointment(appointment.id);

            onStatusUpdated(response.data);

            toast.success("Appointment marked as completed");
        } catch (error) {
            console.error("Complete appointment error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to complete appointment."
            );
        } finally {
            setLoadingAction("");
        }
    };

    const handleCancel = async () => {
        try {
            setLoadingAction("cancel");

            const response = await cancelAppointment(appointment.id);

            onStatusUpdated(response.data);

            toast.success("Appointment cancelled successfully");
        } catch (error) {
            console.error("Cancel appointment error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel appointment."
            );
        } finally {
            setLoadingAction("");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoadingAction("delete");

            await deleteAppointment(appointment.id);

            onAppointmentDeleted(appointment.id);

            toast.success("Appointment deleted successfully");
        } catch (error) {
            console.error("Delete appointment error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete appointment."
            );
        } finally {
            setLoadingAction("");
        }
    };

    const isScheduled = appointment.status === "Scheduled";

    return (
        <tr>
            <td>{appointment.patient_name}</td>

            <td>{appointment.mobile_number}</td>

            <td>{appointment.doctor_name}</td>

            {/* <td>{appointment.appointment_date}</td> */}
            <td>{formatDate(appointment.appointment_date)}</td>

            {/* <td>{appointment.appointment_time?.slice(0, 5)}</td> */}
            <td>{formatTime(appointment.appointment_time)}</td>

            <td>
                <span
                    className={`status-badge status-${appointment.status.toLowerCase()}`}
                >
                    <span className="status-dot"></span>
                    {appointment.status}
                </span>
            </td>

            <td>
                <div className="action-buttons">
                    {isScheduled && (
                        <>
                            <button
                                type="button"
                                className="complete-button"
                                onClick={handleComplete}
                                disabled={loadingAction !== ""}
                            >
                                {loadingAction === "complete" ? "Completing..." : "Complete"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                                disabled={loadingAction !== ""}
                            >
                                {loadingAction === "cancel" ? "Cancelling..." : "Cancel"}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={loadingAction !== ""}
                    >
                        {/* {loadingAction === "delete" ? "..." : "Delete"} */}
                        {loadingAction === "delete" ? "..." : "Delete"}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default AppointmentRow;