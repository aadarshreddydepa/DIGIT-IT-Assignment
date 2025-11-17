# 🎓 **EdTech Task Manager — MERN + TypeScript + TailwindCSS**

A full-stack Learning Management Task System that enables **teachers** to create and assign tasks to students, and allows **students** to manage, update, and track their learning progress.

This project includes complete **role-based access control (RBAC)**, analytics, authentication, and a clean dashboard UI built with React, TypeScript, and Tailwind.

---

## 📂 Project Structure

```
/client     → React + TypeScript frontend  
/server     → Node.js + Express + MongoDB backend
```

---

# 🚀 Features

## 👨‍🏫 **Teacher Features**

* Create tasks for students
* View tasks for **all students assigned to them**
* Update/delete **only tasks they created**
* Side panel with list of students
* Pagination on teacher task view (10 per page)
* Filters:

  * Overdue
  * Due this week

---

## 👨‍🎓 **Student Features**

* Create personal tasks
* Update or delete **tasks assigned to them** (even if created by teacher)
* View teacher name on dashboard + student profile pane
* Analytics overview:

  * total tasks
  * completed
  * pending
  * overdue

---

## 🔐 Authentication & RBAC

### Signup

* Teacher signs up normally
* Student must select an existing teacher

### Login

* Backend returns:

  * JWT
  * user info
  * teacher info (for students)

### Role-Based Logic (Important)

#### Students:

* Can update tasks where `userId === studentId`
* Can **update teacher-created tasks** assigned to them
* Cannot modify:

  * userId
  * creatorId
* Cannot edit other students' tasks

#### Teachers:

* Can update/delete **only tasks they created**
* Can assign tasks to any student mapped to them
* Cannot edit tasks created by students

---

## 🏗 Technology Stack

### Frontend

* React 19
* TypeScript
* React Router
* Axios
* TailwindCSS
* Vite
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT authentication
* bcrypt for hashing
* dotenv

---

# 📦 Installation & Setup

### Clone the repository

```
git clone https://github.com/aadarshreddydepa/DIGIT-IT-Assignment.git
cd DIGIT-IT-Assignment
```

---

## 🖥 Backend Setup (server/)

```
cd server
npm install
```

Create `.env`:

```
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_secret>
```

Start server:

```
npm run dev
```

Runs at:

```
http://localhost:5001
```

---

## 🌐 Frontend Setup (client/)

```
cd client
npm install
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

# 🔄 API Endpoints

### Auth

```
POST /auth/signup
POST /auth/login
```

### Tasks

```
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

### Teachers

```
GET /teachers          (all teachers)
GET /teachers/:id      (teacher details)
```

---

# 🧭 Teacher Task View Logic (Important)

Teacher can see:

1. Tasks they created
2. Tasks belonging to students assigned to them

Teacher can **edit/delete only tasks created by them**.

This ensures correct LMS-style authority levels and prevents privilege escalation.

---

# 📊 Student Profile Panel

Students can see:

* Name
* Teacher assigned
* Total tasks
* Completed, pending, overdue
* Trend-based insights

---

# 📌 Known Issues (if any)

* Serverless deployments require CORS tuning
* MongoDB Atlas must whitelist public IP or use 0.0.0.0/0
* No file upload feature yet
* Teacher cannot reassign task after creation (could be added)

---

# 💡 Suggestions for Future Improvements

* Add task priority (High / Medium / Low)
* Add dark mode
* Add real-time notifications (Socket.io)
* Add email reminders for overdue tasks
* Add Calendar view for tasks
* Add admin role
* Add teacher-student messaging

---

# 🤖 AI Assistance Disclosure

Some parts of this project (explanations, debugging assistance, code scaffolding, documentation, README creation) were assisted using **ChatGPT**, under the direction and decision-making of the developer (Aadarsh).
All architectural decisions, testing, debugging, and final implementation were done manually by the developer.

---

# 🧑‍💻 Developer

**Aadarsh Reddy Depa**
Engineering Student & Full-Stack Developer
Passionate about MERN, AI tools, and scalable web systems.

---
