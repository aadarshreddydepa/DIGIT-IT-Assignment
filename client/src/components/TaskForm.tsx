import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import type { IUser } from "../types/User";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
  userRole: "student" | "teacher";
}

const TaskForm = ({ onSuccess, userRole }: Props) => {
  const [students, setStudents] = useState<IUser[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    userId: ""
  });

  // Teacher fetches students
  useEffect(() => {
    if (userRole === "teacher") {
      api.get("/students/my").then(res => setStudents(res.data));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api
      .post("/tasks", form)
      .then(() => {
        toast.success("Task created!");
        onSuccess();
      })
      .catch(err => toast.error(err.response?.data?.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        placeholder="Task Title"
        className="w-full p-3 border rounded-md"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        className="w-full p-3 border rounded-md"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        className="w-full p-3 border rounded-md"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />

      {/* If teacher → assign task to student */}
      {userRole === "teacher" && (
        <select
          className="w-full p-3 border rounded-md"
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
          required
        >
          <option value="">Assign to Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      <button className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
