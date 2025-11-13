import type { ITask } from "../types/Task";
import type { IUser } from "../types/User";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: Props) => {
  const { user } = useContext(AuthContext);

  const isOwner =
    typeof task.userId === "string"
      ? task.userId === user?._id
      : (task.userId as IUser)._id === user?._id;

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">

      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>

      {/* Progress */}
      <p className="text-xs text-gray-600 mt-2">
        Progress: <span className="font-medium">{task.progress}</span>
      </p>

      {/* Assigned To */}
      {typeof task.userId === "object" && (
        <p className="text-xs text-gray-500">
          Assigned To: {(task.userId as IUser).name}
        </p>
      )}

      {/* Action Buttons */}
      {isOwner && (
        <div className="flex justify-end gap-3 mt-3">

          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>

        </div>
      )}
    </div>
  );
};

export default TaskCard;
