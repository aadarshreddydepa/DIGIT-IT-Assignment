# 📘 **EdTech Task Manager — MERN + TypeScript + Tailwind**

A role-based learning task manager built for **teachers** and **students**, supporting real-world assignment workflows, progress tracking, RBAC permissions, and a clean, modern UI.

This project delivers a complete **Learning Management System (LMS) Task Module** with:

✔ Authentication
✔ Teacher ↔ Student mapping
✔ Task assignment
✔ Progress tracking
✔ Role-based permissions
✔ Task insights dashboard
✔ Responsive UI

---

# 🚀 **Live Tech Demo (Key Features)**

### 👨‍🏫 **For Teachers**

* Assign tasks to students
* Update or delete tasks **created by themselves**
* View all tasks belonging to their students
* Student list sidebar
* Paginated tasks view (10 per page)
* Filter tasks: overdue, due this week

### 👨‍🎓 **For Students**

* Update tasks assigned by teachers
* Create personal tasks
* Edit or delete tasks assigned to themselves
* View their teacher’s name
* See analytics panel:

  * Total tasks
  * Completed
  * Pending
  * Overdue

### 🖥️ **Frontend**

* React + TypeScript
* TailwindCSS UI
* Beautiful card layout
* Smooth modals for Create/Edit
* Toast notifications
* Fully responsive layout

### 🔐 **Backend**

* Node.js + Express
* MongoDB + Mongoose
* JWT Auth
* Robust RBAC enforcement
* Clean controllers, routes, middleware

---

# 🏗️ **Architecture Overview**

```
/client
  ├── src
  │   ├── pages
  │   ├── components
  │   ├── context
  │   ├── api
  │   ├── types
  │   └── App.tsx

/server
  ├── src
  │   ├── controllers
  │   ├── middleware
  │   ├── models
  │   ├── routes
  │   └── index.js
```

---

# ⚙️ **Tech Stack**

### **Frontend**

* React 19
* TypeScript
* Vite
* TailwindCSS
* Axios
* React Router
* React Hot Toast

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose ORM)
* JWT Authentication
* bcrypt password hashing
* dotenv

---

# 🛡️ **Authentication & Security**

### **Signup**

* Students select a teacher
* Teachers do not select a teacher

### **Login**

* Server returns:

  * JWT Token
  * User object
  * Teacher object (for students)

### **Auth Middleware**

Every protected route checks:

* JWT validity
* Extracts `id` & `role`
* Injects into `req.user`

---

# 🔐 **RBAC Logic (Role-Based Permissions)**

### 👨‍🏫 **Teacher**

Can update/delete:

* Tasks **created by them**

Cannot update tasks:

* Created by student

Can view:

* Tasks of all students assigned to them
* Tasks they created

### 👨‍🎓 **Student**

Can update/delete:

* Tasks assigned **to them**, even if created by the teacher
* Tasks created by themselves

Cannot update:

* Tasks belonging to other students

### 🚨 Protected Fields

Cannot be modified:

* `creatorId`
* `userId`

---

# 📡 **API Endpoints**

## **Auth**

```
POST /auth/signup
POST /auth/login
```

## **Tasks**

```
GET    /tasks
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

### Query Params for GET:

```
?filter=overdue     // tasks past due
?filter=thisWeek    // due next 7 days
?studentId=<id>     // teacher filtering by student
?page=1             // teacher pagination
```

---

# 📦 **Environment Variables**

Create `/server/.env`:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecret123
PORT=5001
```

---

# 🧪 **How to Run the Project**

---

## **Backend Setup**

```bash
cd server
npm install
npm run dev
```

Server runs on:

```
http://localhost:5001
```

---

## **Frontend Setup**

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🧭 **Core User Flows**

---

## 👨‍🏫 Teacher Flow

1. Login
2. Sidebar shows list of students
3. Create tasks and assign to any student
4. Edit/delete tasks they created
5. View all tasks from all assigned students
6. Paginate task list (10 per page)
7. Filter overdue or weekly tasks

---

## 👨‍🎓 Student Flow

1. Login
2. Dashboard shows:

   * Teacher name
   * Task analytics
   * Tasks created by teacher or self
3. Update/edit/delete own tasks
4. Edit tasks assigned by teacher to them

---

# 🎨 UI/UX Capabilities

### ✔ Modern card-based layout

### ✔ Soft shadows

### ✔ Blue-accent theme

### ✔ Smooth modals

### ✔ Responsive grid

### ✔ Sidebar profile + metrics

### ✔ Hover animations

### ✔ Skeleton loading states

---

# 🛠 Future Enhancements (Optional)

* Task priority (P1 / P2 / P3)
* Dark mode switch
* Calendar view
* Chat between teacher ↔ student
* File attachments for assignments
* Student progress graph (Chart.js)
* Notification system

---

# 🧑‍💻 **Developer: Aadarsh**

This project demonstrates:

* Complete MERN mastery
* Real-world RBAC implementation
* Clean folder architecture
* Strong frontend patterns
* Backend API engineering
* Authentication/Authorization depth

---

