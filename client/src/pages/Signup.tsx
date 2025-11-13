import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import type { IUser } from "../types/User";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "teacher",
    teacherId: "",
  });

  useEffect(() => {
    api
      .get("/teachers")
      .then((res) => setTeachers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api
      .post("/auth/signup", form)
      .then(() => {
        toast.success("Account created 🎉");
        navigate("/");
      })
      .catch((err) => toast.error(err.response?.data?.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-md"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            className="w-full p-3 border rounded-md"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as "student" | "teacher" })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* Student must select teacher */}
          {form.role === "student" && (
            <select
              className="w-full p-3 border rounded-md"
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option>Select Your Teacher</option>

              {loading ? (
                <option>Loading...</option>
              ) : (
                teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))
              )}
            </select>
          )}

          <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
            Sign Up
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;
