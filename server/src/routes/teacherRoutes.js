import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id name email");
    res.json(teachers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
