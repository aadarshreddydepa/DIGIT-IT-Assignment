import type { ITask } from "../types/Task";
import { type IUser } from "../types/User";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface Props {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: Props) => {
  const { user } = useContext(AuthContext);

  const assignedUser =
    typeof task.userId === "object" ? (task.userId as IUser) : null;

  const creatorUser =
    typeof task.creatorId === "object" ? (task.creatorId as IUser) : null;

  const isOwner = assignedUser?._id === user?._id;
  const isCreator = creatorUser?._id === user?._id;

  return (
    <div className="bg-white p-4 rounded-xl shadow card-hover border border-gray-100">
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-1">{task.description}</p>

      {/* Assigned To */}
      {assignedUser && (
        <p className="text-xs text-gray-500 mt-2">
          Assigned To: <span className="font-medium">{assignedUser.name}</span>
        </p>
      )}

      {/* Created By */}
      {creatorUser && (
        <p className="text-xs text-gray-500">
          Created By: <span className="font-medium">{creatorUser.name}</span>
        </p>
      )}

      {/* Progress badge */}
      <span
        className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold
        ${
          task.progress === "completed"
            ? "bg-green-100 text-green-700"
            : task.progress === "in-progress"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-200 text-gray-700"
        }
        `}
      >
        {task.progress}
      </span>

      {/* Action buttons */}
      {(isOwner || isCreator) && (
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
