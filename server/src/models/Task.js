import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  progress: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);
