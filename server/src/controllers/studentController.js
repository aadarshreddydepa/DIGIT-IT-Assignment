import User from "../models/User.js";

export const getMyStudents = async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers allowed" });
  }

  const students = await User.find({ teacherId: req.user.id }).select(
    "_id name email"
  );

  res.json(students);
};
