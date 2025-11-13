import Task from "../models/Task.js";
import User from "../models/User.js";

/**
 * CREATE TASK
 * Teacher → can assign to their students
 * Student → can create for themselves
 */
export const createTask = async (req, res) => {
  try {
    const { id, role } = req.user;

    let userId = id; // default: assign to self

    // Teacher assigns a task to a student
    if (role === "teacher" && req.body.userId) {
      const student = await User.findOne({
        _id: req.body.userId,
        teacherId: id,
      });

      if (!student) {
        return res
          .status(403)
          .json({ message: "Invalid student assignment" });
      }

      userId = req.body.userId;
    }

    const task = await Task.create({
      ...req.body,
      userId,
      creatorId: id, // who created the task
    });

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET TASKS
 * Students → Own tasks only
 * Teachers → Tasks they created OR tasks of their students
 */
export const getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { filter, page = 1, studentId } = req.query;

    let query = {};

    // Student → only their own tasks
    if (role === "student") {
      query.userId = id;
    }

    // Teacher view logic
    if (role === "teacher") {
      if (studentId) {
        query.userId = studentId;
      } else {
        const students = await User.find({ teacherId: id }).select("_id");
        const studentIds = students.map((s) => s._id.toString());

        query.$or = [
          { creatorId: id }, // tasks teacher created
          { userId: { $in: studentIds } }, // tasks of teacher's students
        ];
      }
    }

    // Filters
    const now = new Date();

    if (filter === "overdue") {
      query.dueDate = { $lt: now };
    }

    if (filter === "thisWeek") {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      query.dueDate = { $gte: now, $lte: nextWeek };
    }

    // Pagination only for teachers
    let tasks, total;

    if (role === "teacher") {
      const limit = 10;
      const skip = (page - 1) * limit;

      total = await Task.countDocuments(query);

      tasks = await Task.find(query)
        .populate("userId", "name email role")
        .populate("creatorId", "name email role") // FIX #1
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      tasks = await Task.find(query)
        .populate("userId", "name email role")
        .populate("creatorId", "name email role") // FIX #1
        .sort({ createdAt: -1 });
    }

    res.json(role === "teacher" ? { tasks, total } : tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * UPDATE TASK
 * Student → can update tasks assigned TO THEM
 * Teacher → can update tasks THEY created
 */
export const updateTask = async (req, res) => {
  try {
    const { id, role } = req.user;

    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Task not found" });

    const isOwner = task.userId.toString() === id;
    const isCreator = task.creatorId.toString() === id;

    // 🎯 Students can update tasks assigned to them
    if (role === "student" && !isOwner) {
      return res.status(403).json({
        message: "Students can only edit tasks assigned to them",
      });
    }

    // 🎯 Teachers can update only tasks they created
    if (role === "teacher" && !isCreator) {
      return res.status(403).json({
        message: "Teachers can only edit tasks they created",
      });
    }

    // Protect system fields
    delete req.body.userId;
    delete req.body.creatorId;

    const allowed = ["title", "description", "dueDate", "progress"];
    Object.keys(req.body).forEach((key) => {
      if (!allowed.includes(key)) delete req.body[key];
    });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE TASK
 * Student → can delete tasks assigned to them
 * Teacher → can delete tasks they created
 */
export const deleteTask = async (req, res) => {
  try {
    const { id, role } = req.user;

    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Task not found" });

    const isOwner = task.userId.toString() === id;
    const isCreator = task.creatorId.toString() === id;

    if (role === "student" && !isOwner) {
      return res.status(403).json({
        message: "Students can only delete their tasks",
      });
    }

    if (role === "teacher" && !isCreator) {
      return res.status(403).json({
        message: "Teachers can only delete tasks they created",
      });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
