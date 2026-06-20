# Mini Project Management App

A comprehensive full-stack task management application with a React frontend and Node.js backend.

## Assumptions
- The database is MongoDB and is running locally at `mongodb://127.0.0.1:27017/taskmanager`.
- Node.js and NPM are installed on the machine.
- Cross-Origin Resource Sharing (CORS) is enabled allowing the frontend on localhost:5173 to communicate with the backend on localhost:5000.
- Vite uses port 5173 by default for the dev server.

## Technologies Used
**Frontend:**
- React (bootstrapped with Vite)
- Tailwind CSS (for styling and Dark Mode)
- Axios (for API requests)
- React Router DOM (for routing)
- Lucide React (for UI icons)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose (Database & ORM)
- dotenv (Environment variables)

## Setup Steps

### 1. Clone the repository
```bash
git clone <repository_url>
cd "mini project management"
```

### 2. Setup Database (MongoDB)
Ensure you have MongoDB installed and running locally on port 27017. Alternatively, update the `MONGO_URI` in `backend/.env` to point to your MongoDB Atlas instance.

### 3. Setup and Run Backend
Open a new terminal window:
```bash
cd backend
npm install
npm run dev
```
*The server will start on http://localhost:5000*

### 4. Setup and Run Frontend
Open another terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The app will start on http://localhost:5173*

## API Documentation

### Base URL: `http://localhost:5000`

### Endpoints

#### 1. Get All Tasks
- **URL**: `/tasks`
- **Method**: `GET`
- **Response**: Array of task objects.
```json
[
  {
    "_id": "64d25fa1b8c2d1",
    "title": "Build Login Page",
    "description": "Create a responsive login page",
    "status": "Pending",
    "created_at": "2023-08-08T10:00:00.000Z"
  }
]
```

#### 2. Create a Task
- **URL**: `/tasks`
- **Method**: `POST`
- **Request Body**:
```json
{
  "title": "Build Login Page",
  "description": "Create a responsive login page",
  "status": "Pending"
}
```
- **Validation**: 
  - `title` is required
  - `description` is required and must be minimum 20 characters
- **Response**: Created task object.

#### 3. Update Task Status
- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Request Body**:
```json
{
  "status": "Completed"
}
```
- **Response**: Updated task object.

#### 4. Delete a Task
- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Response**: 
```json
{
  "message": "Task removed"
}
```
