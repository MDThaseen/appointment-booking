import { useState } from "react";
import "./App.css";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import { ToastContainer } from "react-toastify";

function App() {
  const [refresh, setRefresh] = useState(0);

  // Refresh appointment list after creating a new appointment
  const handleAppointmentCreated = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Appointment Booking</h1>
          <p>Manage doctor appointments easily</p>
        </div>
      </header>

      <main className="container">
        <AppointmentForm
          onAppointmentCreated={handleAppointmentCreated}
        />

        <AppointmentList refresh={refresh} />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;