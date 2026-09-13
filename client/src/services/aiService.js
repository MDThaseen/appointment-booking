import axios from "axios";

// const API_URL = "http://localhost:5000/api/ai";
const API_URL = `${import.meta.env.VITE_API_URL}/ai`;

export const generateAppointmentSummary = async (reason) => {
  const response = await axios.post(`${API_URL}/summary`, {
    reason,
  });

  return response.data;
};


// {"error":{"code":503,"message":"This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.","status":"UNAVAILABLE"}}