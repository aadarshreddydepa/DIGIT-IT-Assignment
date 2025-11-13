import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { filter, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    let baseQuery;

    if (role === "student") {
      baseQuery = { userId: id };
    } 
    else if (role === "teacher") {
      const students = await User.find({ teacherId: id }).select("_id");
      const studentIds = students.map(s => s._id);

      baseQuery = {
        $or: [{ userId: id }, { userId: { $in: studentIds } }]
      };
    }

    // --- Date Filtering ---
    const now = new Date();

    if (filter === "overdue") {
      baseQuery.dueDate = { $lt: now };
    }

    if (filter === "thisWeek") {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + 7);

      baseQuery.dueDate = { $gte: now, $lte: weekEnd };
    }

    // --- Pagination applies only for teacher ---
    const query = Task.find(baseQuery).sort({ createdAt: -1 });

    if (role === "teacher") {
      query.skip(skip).limit(Number(limit));
    }

    const tasks = await query;

    res.json({
      tasks,
      page: Number(page),
      limit: Number(limit),
      total: role === "teacher"
        ? await Task.countDocuments(baseQuery)
        : tasks.length 
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* Create task */
export const createTask = async (req, res) => {
  try {
    const { id } = req.user;
    const task = await Task.create({ ...req.body, userId: id });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* Update task (owner only) */
export const updateTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // STUDENT → can modify ONLY their own tasks
    if (role === "student") {
      if (task.userId.toString() !== id) {
        return res.status(403).json({ message: "Students cannot modify this task" });
      }
    }

    // TEACHER → can modify ONLY tasks they personally created
    if (role === "teacher") {
      if (task.userId.toString() !== id) {
        return res.status(403).json({ message: "Teachers cannot modify student tasks" });
      }
    }

    // Authorized → Update
    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id, role } = req.user;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // STUDENT → can delete ONLY their own tasks
    if (role === "student") {
      if (task.userId.toString() !== id) {
        return res.status(403).json({ message: "Students cannot delete this task" });
      }
    }

    // TEACHER → can delete ONLY tasks they personally created
    if (role === "teacher") {
      if (task.userId.toString() !== id) {
        return res.status(403).json({ message: "Teachers cannot delete student tasks" });
      }
    }

    await task.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};