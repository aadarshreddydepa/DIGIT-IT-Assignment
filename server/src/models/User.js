import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  passwordHash: { 
    type: String, 
    required: true 
  },

  role: { 
    type: String, 
    enum: ["student", "teacher"], 
    required: true 
  },

  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
});

export default mongoose.model("User", userSchema);
