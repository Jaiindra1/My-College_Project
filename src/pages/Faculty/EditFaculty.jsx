import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

export default function EditFaculty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
    username: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch existing faculty details
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data } = await api.get(`/faculty/${id}`);
        setForm(data);
      } catch (err) {
        console.error("❌ Failed to fetch faculty details:", err);
        alert("Failed to fetch faculty details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/faculty/${id}`, form);
      alert("✅ Faculty updated successfully!");
      navigate("/admin/faculty");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Update failed. Please try again.");
    }
  };

  if (loading) return <div className="p-8">Loading faculty details...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          ✏️ Edit Faculty
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 max-w-xl mx-auto"
        >
          {/* Name */}
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
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@college.edu"
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
              value={form.phone || ""}
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

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 
                       text-white font-semibold rounded-lg shadow-md transition-all"
          >
            💾 Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
