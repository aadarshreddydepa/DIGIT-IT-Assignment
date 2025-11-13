import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, teacherId } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    if (role === "student" && !teacherId) {
      return res.status(400).json({ message: "teacherId is required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      teacherId: role === "student" ? teacherId : null
    });

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Add teacher details for student
    let teacher = null;

    if (user.role === "student" && user.teacherId) {
      teacher = await User.findById(user.teacherId).select("name email");
    }

    res.json({ token, user, teacher });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

