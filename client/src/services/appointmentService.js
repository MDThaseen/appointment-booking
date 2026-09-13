import axios from "axios";

// const API_URL = "http://localhost:5000/api/appointments";
const API_URL = `${import.meta.env.VITE_API_URL}/appointments`;

// get all appointments
export const getAppointments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// create appointment
export const createAppointment = async (appointmentData) => {
  const response = await axios.post(API_URL, appointmentData);
  return response.data;
};

// merk appointment completed
export const completeAppointment = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/complete`);
  return response.data;
};

// cancal appointment
export const cancelAppointment = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`);
  return response.data;
};

// dalete appointment
export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};