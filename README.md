# Appointment Booking App

This is a Mini Appointment Booking Application that I developed as a Full Stack Developer practical assignment.

The application allows users to book appointments by entering patient details, doctor details, appointment date and time. Users can also view all appointments and manage their appointment status.

I also added a small AI feature using Gemini API that analyzes the reason for visiting and generates a useful appointment summary.

## Features

* Book a new appointment
* View all appointments
* Search appointments by patient name, doctor name or mobile number
* Filter appointments by status
* Mark an appointment as Completed
* Cancel an appointment
* Delete an appointment
* Form validation
* Responsive design for desktop, tablet and mobile
* Success and error notifications
* Persistent data using Supabase PostgreSQL
* AI-based appointment reason analysis and summary
* Handles temporary AI service failures without crashing the backend

## Technologies Used

### Frontend

* React.js
* Vite
* Axios
* React Toastify
* CSS

### Backend

* Node.js
* Express.js
* Axios
* CORS
* dotenv

### Database

* Supabase
* PostgreSQL

### AI

* Google Gemini API
* `@google/genai`

## Project Structure

```text
appointment-booking/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## How to Run the Project

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd appointment-booking
```

### 2. Run the Backend

Go to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Run the Frontend

Open another terminal and go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at the URL shown in the terminal, usually:

```text
http://localhost:5173
```

## API Endpoints

### Appointments

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| GET    | `/api/appointments`              | Get all appointments          |
| POST   | `/api/appointments`              | Create an appointment         |
| PATCH  | `/api/appointments/:id/complete` | Mark appointment as completed |
| PATCH  | `/api/appointments/:id/cancel`   | Cancel an appointment         |
| DELETE | `/api/appointments/:id`          | Delete an appointment         |

### AI

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/api/ai/summary` | Analyze the appointment reason |

## AI Feature

The AI feature uses the Google Gemini API to analyze the patient's reason for visiting.

It checks whether the given reason is a valid healthcare-related appointment reason and provides information such as:

* Appointment summary
* Primary concern
* Duration
* Additional symptoms
* Relevant details
* Visit purpose

The AI feature is designed only for appointment analysis and summarization. It does not diagnose diseases or recommend medicines or treatments.

If the Gemini service is temporarily unavailable, the backend handles the error without stopping the main appointment booking server.

## Database

The application uses Supabase PostgreSQL to store appointment information.

The appointment table stores:

* Patient name
* Mobile number
* Doctor name
* Appointment date
* Appointment time
* Appointment status
* Created date

The data remains available even after refreshing the application.

## Validation

The application includes validation for:

* Required fields
* Patient name
* 10-digit mobile number
* Doctor name
* Appointment date
* Appointment time
* Past appointment dates
* Duplicate doctor appointment at the same date and time

## Future Improvements

Some features that can be added in the future are:

* User authentication
* Doctor management
* Appointment reminders
* Email/SMS notifications
* Calendar integration
* Admin dashboard
* React Native mobile application

## Author

Developed by **Mohammed Thaseen** as a Full Stack Developer practical assignment.
