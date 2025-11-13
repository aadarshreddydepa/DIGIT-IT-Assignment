import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { page = 1, filter, studentId } = req.query;

    const limit = 10;
    const skip = (page - 1) * limit;

    let baseQuery = {};

    if (role === "student") {
      baseQuery.userId = id;
    }

    if (role === "teacher") {
      const students = await User.find({ teacherId: id }).select("_id");
      const studentIds = students.map((s) => s._id);

      baseQuery.$or = [{ userId: id }, { userId: { $in: studentIds } }];

      if (studentId) {
        baseQuery = { userId: studentId };
      }
    }

    // --- Date Filtering ---
    const now = new Date();

    if (filter === "overdue") baseQuery.dueDate = { $lt: now };

    if (filter === "thisWeek") {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + 7);
      baseQuery.dueDate = { $gte: now, $lte: weekEnd };
    }

    const query = Task.find(baseQuery).populate("userId", "name email");

    if (role === "teacher") query.skip(skip).limit(limit);

    const tasks = await query;

    res.json({
      tasks,
      total: role === "teacher" ? await Task.countDocuments(baseQuery) : tasks.length,
      page: Number(page)
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { id, role } = req.user;

    let userId = id;

    // Teacher assigning task to student
    if (role === "teacher" && req.body.userId) {
      const student = await User.findOne({
        _id: req.body.userId,
        teacherId: id
      });
      if (!student) {
        return res.status(403).json({ message: "Invalid student assignment" });
      }
      userId = req.body.userId;
    }

    const task = await Task.create({
      ...req.body,
      userId
    });

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.userId.toString() === id;

    if (!isOwner)
      return res.status(403).json({ message: "Not authorized to modify" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== id)
      return res.status(403).json({ message: "Not authorized" });

    await task.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
