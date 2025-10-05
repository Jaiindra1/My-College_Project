import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const UpdateStatus = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all registrations
  const fetchRegistrations = async () => {
    try {
      const { data } = await api.get("/placements/registrations");
      setRegistrations(data);
    } catch (err) {
      console.error("❌ Failed to fetch registrations:", err);
      alert("Failed to load registered students.");
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Handle status update for a student
  const handleStatusChange = async (reg_id, newStatus) => {
    if (!window.confirm(`Update status to "${newStatus}"?`)) return;
    setLoading(true);
    try {
      await api.put(`/placements/${reg_id}/status`, { status: newStatus });
      alert("✅ Status updated successfully");
      fetchRegistrations(); // refresh after update
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🎯 Manage Placement Registrations
        </h1>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="w-full border text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <tr>
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Company</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Current Status</th>
                <th className="p-3 border text-center">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map((r) => (
                  <tr key={r.reg_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 border">{r.student_name}</td>
                    <td className="p-3 border">{r.roll_no}</td>
                    <td className="p-3 border">{r.company_name}</td>
                    <td className="p-3 border">{r.job_role}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          r.status === "selected"
                            ? "bg-green-200 text-green-700"
                            : r.status === "rejected"
                            ? "bg-red-200 text-red-700"
                            : "bg-yellow-200 text-yellow-700"
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.reg_id, e.target.value)}
                        disabled={loading}
                        className="px-2 py-1 border rounded-md text-sm"
                      >
                        <option value="registered">Registered</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No registered students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default UpdateStatus;
