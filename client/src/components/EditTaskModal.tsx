import { useState } from "react";
import api from "../api/axiosInstance";
import type { ITask } from "../types/Task";
import toast from "react-hot-toast";

interface Props {
  task: ITask;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTaskModal = ({ task, onClose, onUpdated }: Props) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate?.substring(0, 10) || "",
    progress: task.progress,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api
      .put(`/tasks/${task._id}`, form)
      .then(() => {
        toast.success("Task updated!");
        onUpdated();
        onClose();
      })
      .catch(err => toast.error(err.response?.data?.message));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-5">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">

        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            className="w-full p-3 border rounded-md"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
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

          <select
            className="w-full p-3 border rounded-md"
            value={form.progress}
            onChange={(e) =>
              setForm({
                ...form,
                progress: e.target.value as ITask["progress"],
              })
            }
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
