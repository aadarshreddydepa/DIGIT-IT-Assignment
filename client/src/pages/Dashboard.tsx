import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosInstance";
import {type ITask } from "../types/Task";
import { type IUser } from "../types/User";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import EditTaskModal from "../components/EditTaskModal";
import StudentList from "../components/StudentList";
import SkeletonCard from "../components/SkeletonCard";
import toast from "react-hot-toast";
import StudentProfile from "../components/StudentProfile";

const Dashboard = () => {
  const { user, logout, teacher } = useContext(AuthContext);

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<ITask | null>(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [teacherInfo, setTeacherInfo] = useState<IUser | null>(null);

  // Fetch tasks with filters + pagination
  const loadTasks = () => {
    setLoading(true);

    api
      .get(
        `/tasks?filter=${filter}&page=${page}${
          studentFilter ? `&studentId=${studentFilter}` : ""
        }`
      )
      .then((res) => {
        setTasks(res.data.tasks || res.data);
        setTotal(res.data.total || 0);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [filter, page, studentFilter]);

  // Fetch assigned teacher info for student
  useEffect(() => {
    if (user?.role === "student" && user.teacherId) {
      api
        .get("/teachers/" + user.teacherId)
        .then((res) => setTeacherInfo(res.data))
        .catch(() => {});
    }
  }, []);

  const handleDelete = (id: string) => {
    api
      .delete(`/tasks/${id}`)
      .then(() => {
        toast.success("Task deleted");
        loadTasks();
      })
      .catch((err) => toast.error(err.response?.data?.message));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex">

      {/* LEFT SIDEBAR (Teacher only) */}
      {user?.role === "teacher" && (
        <div className="hidden md:block w-64 mr-4">
          <StudentList
            onSelect={(id) => {
              setStudentFilter(id);
              setPage(1);
            }}
          />
        </div>
      )}
{user?.role === "student" && (
  <div className="hidden md:block w-64 mr-4">
    <StudentProfile />
  </div>
)}

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-5">
          <div>
            <h1 className="text-xl font-bold">
              Welcome, {user?.name} ({user?.role})
            </h1>

            {user?.role === "student" && teacherInfo && (
              <p className="text-gray-600 text-sm">
                Teacher: <span className="font-medium">{teacherInfo.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex justify-between mb-4 bg-white p-4 rounded-lg shadow-md">
          <select
            className="p-2 border rounded-md"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Tasks</option>
            <option value="overdue">Overdue</option>
            <option value="thisWeek">Due This Week</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        {/* TASK GRID */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
                onEdit={(t) => setEditTask(t)}
              />
            ))}
          </div>
        )}

        {/* PAGINATION (Teacher only) */}
        {user?.role === "teacher" && (
          <div className="flex justify-center mt-6 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page * 10 >= total}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* CREATE TASK MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-5">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <TaskForm
              onSuccess={() => {
                setShowForm(false);
                loadTasks();
              }}
              userRole={user!.role}
            />

            <button
              className="w-full mt-3 p-2 bg-red-300 rounded"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={loadTasks}
        />
      )}

    </div>
  );
};

export default Dashboard;
