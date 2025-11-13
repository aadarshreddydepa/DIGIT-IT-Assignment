import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get list of teachers (already exists)
router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select("_id name email");
  res.json(teachers);
});

// NEW: get teacher by ID
router.get("/:id", async (req, res) => {
  const teacher = await User.findById(req.params.id).select("_id name email");
  res.json(teacher);
});

export default router;
