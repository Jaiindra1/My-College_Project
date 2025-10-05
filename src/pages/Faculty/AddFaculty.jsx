import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

export default function AddFaculty() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/faculty", form);
      alert("✅ Faculty added successfully!");
      navigate("/admin/faculty");
    } catch (err) {
      console.error("❌ Error adding faculty:", err);
      alert("❌ Failed to add faculty. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          ➕ Add New Faculty
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 max-w-xl mx-auto"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="faculty@college.edu"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="faculty_username"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700 
                       text-white font-semibold rounded-lg shadow-md transition-all"
          >
            ➕ Add Faculty
          </button>
        </form>
      </main>
    </div>
  );
}
