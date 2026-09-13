import { useEffect, useState } from "react";
import { getAppointments } from "../services/appointmentService";
import AppointmentRow from "./AppointmentRow";

const AppointmentList = ({ refresh }) => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAppointments();

            setAppointments(response.data || []);
        } catch (error) {
            console.error("Fetch appointments error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load appointments. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [refresh]);

    // Remove appointment from UI after delete
    const handleAppointmentDeleted = (id) => {
        setAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== id)
        );
    };

    // Update appointment status in UI
    const handleStatusUpdated = (updatedAppointment) => {
        setAppointments((prev) =>
            prev.map((appointment) =>
                appointment.id === updatedAppointment.id
                    ? updatedAppointment
                    : appointment
            )
        );
    };

    const filteredAppointments = appointments.filter((appointment) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            appointment.patient_name.toLowerCase().includes(search) ||
            appointment.doctor_name.toLowerCase().includes(search) ||
            appointment.mobile_number.includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            appointment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <section className="appointment-list">
                <h2>Appointments</h2>
                <p className="loading-message">Loading appointments...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="appointment-list">
                <h2>Appointments</h2>
                <p className="error-message">{error}</p>

                <button type="button" onClick={fetchAppointments}>
                    Try Again
                </button>
            </section>
        );
    }

    return (
        <section className="appointment-list">
            <div className="list-header">
                <div>
                    <h2>Appointments</h2>
                    <p>
                        {filteredAppointments.length}{" "}
                        {filteredAppointments.length === 1
                            ? "appointment"
                            : "appointments"}
                    </p>
                </div>

                <button type="button" onClick={fetchAppointments}>
                    Refresh
                </button>
            </div>

            <div className="appointment-filters">
                <input
                    type="text"
                    placeholder="Search patient, doctor or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="empty-state">
                    <h3>No appointments found</h3>
                    <p>
                        {appointments.length === 0
                            ? "Book an appointment to see it here."
                            : "No appointments match your search or filter."}
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Mobile</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAppointments.map((appointment) => (
                                <AppointmentRow
                                    key={appointment.id}
                                    appointment={appointment}
                                    onAppointmentDeleted={handleAppointmentDeleted}
                                    onStatusUpdated={handleStatusUpdated}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default AppointmentList;