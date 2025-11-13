import express from "express";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all teachers
router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("_id name email");
  res.json(teachers);
});

// Get specific teacher by ID  <-- MISSING ROUTE
router.get("/:id", auth, async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select("name email role");

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
