import { useEffect, useState, useContext } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { type ITask } from "../types/Task";
import {type IUser } from "../types/User";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [teacher, setTeacher] = useState<IUser | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    if (!user?.teacherId) return;

    api.get("/teachers/" + user.teacherId).then((res) => setTeacher(res.data));

    api.get("/tasks").then((res) => {
      const tasks: ITask[] = res.data.tasks || res.data;

      const now = new Date();

      const total = tasks.length;
      const completed = tasks.filter((t) => t.progress === "completed").length;
      const pending = tasks.filter((t) => t.progress !== "completed").length;
      const overdue = tasks.filter((t) => new Date(t.dueDate!) < now).length;

      setStats({ total, completed, pending, overdue });
    });
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl shadow card-hover mb-5 w-full">
      <h2 className="text-lg font-bold mb-3">Student Profile</h2>

      <p className="text-sm text-gray-700">
        <span className="font-semibold">Name:</span> {user?.name}
      </p>

      <p className="text-sm text-gray-700">
        <span className="font-semibold">Teacher:</span> {teacher?.name}
      </p>

      <div className="mt-4">
        <p className="text-sm">Total Tasks: {stats.total}</p>
        <p className="text-sm text-green-700">Completed: {stats.completed}</p>
        <p className="text-sm text-yellow-700">Pending: {stats.pending}</p>
        <p className="text-sm text-red-700">Overdue: {stats.overdue}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
