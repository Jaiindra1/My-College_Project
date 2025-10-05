import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const RegisterStudent = () => {
  const [form, setForm] = useState({ roll_no: "", company_id: "" });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Companies for Dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get("/placements/company");
        setCompanies(data);
      } catch (err) {
        console.error("❌ Failed to fetch companies:", err);
        alert("Failed to load companies list");
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.roll_no || !form.company_id) {
      alert("⚠️ Please enter Roll Number and select a Company.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/placements/register", form); // Backend expects roll_no & company_id
      alert("✅ Student registered for the drive successfully!");
      setForm({ roll_no: "", company_id: "" }); // Reset form
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert(err.response?.data?.error || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            📝 Register Student for Placement Drive
          </h1>

          {/* Student Roll Number */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              🎓 Student Roll Number
            </label>
            <input
              type="text"
              name="roll_no"
              value={form.roll_no}
              onChange={handleChange}
              placeholder="Enter Roll Number (e.g. 22CSE001)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Company Select */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              🏢 Select Company
            </label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.name} ({c.role})
                </option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white 
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
              transition-all duration-200 shadow-md`}
          >
            {loading ? "Registering..." : "✅ Register Student"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default RegisterStudent;
