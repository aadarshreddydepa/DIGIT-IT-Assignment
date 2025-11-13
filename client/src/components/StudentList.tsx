import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import type { IUser } from "../types/User";

interface Props {
  onSelect: (id: string | null) => void;
}

const StudentList = ({ onSelect }: Props) => {
  const [students, setStudents] = useState<IUser[]>([]);

  useEffect(() => {
    api.get("/students/my").then((res) => setStudents(res.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h2 className="font-bold text-lg mb-4">My Students</h2>

      <button
        onClick={() => onSelect(null)}
        className="text-blue-600 block mb-3"
      >
        ➤ View All Tasks
      </button>

      {students.map((std) => (
        <button
          key={std._id}
          onClick={() => onSelect(std._id)}
          className="block w-full py-2 px-2 text-left rounded hover:bg-gray-100"
        >
          {std.name}
        </button>
      ))}
    </div>
  );
};

export default StudentList;
