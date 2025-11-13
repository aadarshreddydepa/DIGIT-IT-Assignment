import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// routes
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
app.use("/teachers", teacherRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🚀 MongoDB connected");
    app.listen(5001, () => console.log("Server running on port 5001"));
  })
  .catch((err) => console.log(err));
