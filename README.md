# LMS Project What is your LMS project?

A full-stack Learning Management System built with a static frontend and a Node.js backend. The project provides secure login, role-based dashboards (Admin, Teacher, Student) modeled after a modern university portal (CUIMS-style), student record management, and MongoDB-based data storage.

## Features

- Secure login for admin, teacher, and student users
- JWT-based authentication
- Password hashing with `bcryptjs`
- **Admin Dashboard**: Register new students and view all enrolled students.
- **Teacher Dashboard**: Update student grades and attendance.
- **Student Dashboard**: View personal academic details, attendance, timetable, and subjects.
- MongoDB integration for storing users and student data
- Premium glassmorphism-style user interface matching modern university dashboards

## Tech Stack

- Frontend: HTML, CSS, JavaScript (Vanilla, no framework)
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Authentication: JWT, bcryptjs
- Utilities: CORS, dotenv

## Project Structure

```text
LMS_Project/
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── glass-style.css
├── backend-node/
│   ├── models/
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── apiRoutes.js
│   │   └── authRoutes.js
│   ├── server.js
│   └── package.json
└── backend-java/
```

## User Roles

### Admin

- Log in to the portal
- Register new student records (creates them with default empty subjects/attendance)
- View all enrolled students in the dashboard grid

### Teacher

- Log in to the portal
- Update student records (grades and attendance percentages)
- View all students in the dashboard grid

### Student

- Log in using enrollment ID as username
- View personal academic records (course, grades, attendance, subjects, and percentages)
- Access a read-only student dashboard

## How It Works

- The frontend sends login requests to the Node.js authentication API.
- The backend validates credentials and returns a JWT token.
- The token, username, and role are stored in `localStorage`.
- Based on the user's role, the frontend displays the corresponding panels (Admin Panel, Teacher Panel, or Student Panel) and fetches the appropriate data.

## Getting Started & Running the Project

> **Important Note:** You must start the Node server from inside the `backend-node` folder, not the root project folder.

### 1. Start the backend

Open your terminal and run the following commands:

```bash
cd "backend-node"
npm install
node server.js
```

The backend runs on `http://localhost:5000`. Keep this terminal window open.

### 2. Configure environment variables (If not already set)

Ensure your `backend-node/.env` file has the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Run the frontend

Open a new terminal window or simply open the file in your browser.

**Option A: Open directly in browser**
Double-click `frontend/index.html` on your computer to open it in Chrome/Safari/Firefox.

**Option B: Using a local server (Recommended)**
```bash
cd frontend
python3 -m http.server 5500
```
Then open your browser to `http://localhost:5500`.

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /status` - check backend status
- `GET /students` - fetch all student records
- `POST /students` - create a new student record
- `PUT /students/:enrollmentId` - update a student record (teachers updating grades/attendance)

Authentication routes:

- `POST /auth/register` - register a new user
- `POST /auth/login` - log in and receive JWT token

## Database Models

### User

- `username`
- `password`
- `role` (`admin`, `teacher`, or `student`)

### Student

- `name`
- `enrollmentId`
- `course`
- `grade`
- `attendance`
- `subjects` (Array of objects containing name, semester, marksPercentage)
- `timetable` (Array of objects containing day, time, subject, room)
- `createdAt`

## Author

Gurudutt Tiwari
