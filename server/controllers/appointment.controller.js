import supabase from "../config/supabase.js";


export const createAppointment = async (req, res, next) => {
    try {
        const {
            patient_name,
            mobile_number,
            doctor_name,
            appointment_date,
            appointment_time,
        } = req.body || {};

        if (
            !patient_name ||
            !mobile_number ||
            !doctor_name ||
            !appointment_date ||
            !appointment_time
        ) {
            return res.status(400).json({
                success: false,
                message: "All appointment fields are required",
            });
        }

        const patientName = patient_name.trim();
        const mobileNumber = mobile_number.trim();
        const doctorName = doctor_name.trim();

        if (patientName.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Patient name must contain at least 2 characters",
            });
        }

        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit mobile number",
            });
        }

        if (doctorName.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Doctor name is required",
            });
        }

        // prevent booking a past date
        const today = new Date().toISOString().split("T")[0];

        if (appointment_date < today) {
            return res.status(400).json({
                success: false,
                message: "Appointment date cannot be in the past",
            });
        }

        // doctor already has an appointment ???????
        // at the selected date and time.
        const { data: existingAppointment, error: existingError } =
            await supabase
                .from("appointments")
                .select("id")
                .eq("doctor_name", doctorName)
                .eq("appointment_date", appointment_date)
                .eq("appointment_time", appointment_time)
                .eq("status", "Scheduled")
                .maybeSingle();

        if (existingError) {
            return next(existingError);
        }

        if (existingAppointment) {
            return res.status(409).json({
                success: false,
                message:
                    "This doctor already has an appointment at the selected date and time",
            });
        }

        // create appointment
        const { data, error } = await supabase
            .from("appointments")
            .insert([
                {
                    patient_name: patientName,
                    mobile_number: mobileNumber,
                    doctor_name: doctorName,
                    appointment_date,
                    appointment_time: appointment_time,
                    status: "Scheduled",
                },
            ])
            .select()
            .single();

        if (error) {
            return next(error);
        }

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// getting all the appointment  
export const getAppointments = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true });

        if (error) {
            return next(error);
        }

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

// make complete ???
export const completeAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const { data, error } = await supabase
            .from("appointments")
            .update({ status: "Completed" })
            .eq("id", id)
            .eq("status", "Scheduled")
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found or cannot be completed",
                });
            }

            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Appointment marked as completed",
            data,
        });
    } catch (error) {
        next(error);
    }
};

//  cancel appointment
export const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const { data, error } = await supabase
            .from("appointments")
            .update({ status: "Cancelled" })
            .eq("id", id)
            .eq("status", "Scheduled")
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found or cannot be cancelled",
                });
            }

            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};


//  delete appointment
export const deleteAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const { data, error } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found",
                });
            }

            return next(error);
        }

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};