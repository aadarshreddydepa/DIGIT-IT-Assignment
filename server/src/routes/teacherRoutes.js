import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const teachers = await User.find({ role: "teacher" }).select(
    "_id name email"
  );
  res.json(teachers);
});

export default router;
