import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function AddStudent() {
  const [regulations, setRegulations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    username: "",
    email: "",
    password: "",
    regulation_id: "",
    join_year: "",
  });
  const navigate = useNavigate();

  // Fetch regulations from backend
  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const { data } = await api.get("/regulations");
        setRegulations(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load regulations");
      }
    };
    fetchRegs();
  }, []);

  // Generate join years dynamically
  const currentYear = new Date().getFullYear();
  const joinYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", form);
      alert("✅ Student added successfully!");
      navigate("/students");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add student");
    }
  };

  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          ➕ Add New Student
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-2xl space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Roll No */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Roll Number
            </label>
            <input
              name="roll_no"
              value={form.roll_no}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Ex: 20XXA0501"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Set initial password"
              required
            />
          </div>

          {/* Regulation Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Regulation
            </label>
            <select
              name="regulation_id"
              value={form.regulation_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">-- Select Regulation --</option>
              {regulations.map((r) => (
                <option key={r.regulation_id} value={r.regulation_id}>
                  {r.name} ({r.start_year}-{r.end_year})
                </option>
              ))}
            </select>
          </div>

          {/* Join Year Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Join Year
            </label>
            <select
              name="join_year"
              value={form.join_year}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">-- Select Join Year --</option>
              {joinYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Save Student
          </button>
        </form>
      </main>
    </div>
  );
}
