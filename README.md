
Student Management System (React + Vite + Express + MySQL)
========================================================

What you get
- frontend/  -> Vite + React app (Tailwind CSS) - UI matching the provided design (approximate)
- backend/   -> Express server with REST routes for students
- db.sql     -> MySQL schema to create the `students` table
- .env.example -> env sample for backend

How to run locally
1. Backend
   - cd backend
   - npm install
   - Create a MySQL database and update .env with your credentials
   - Import db.sql: mysql -u root -p student_db < db.sql
   - npm run dev
   - Backend runs at http://localhost:4000

2. Frontend
   - cd frontend
   - npm install
   - npm run dev
   - Frontend runs at http://localhost:5173 (Vite default) and talks to backend via proxy

Notes
- The project uses mysql2. Ensure MySQL server is running and credentials in backend/.env
- This is a starter app matching the UI provided; feel free to extend validation, auth, or production packaging.
