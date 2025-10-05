import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";  // Student's sidebar
import api from "../../api/axiosInstance";

export default function StudentPlacementPortal() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registeredCompanies, setRegisteredCompanies] = useState([]);

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const { data } = await api.get("/placements/company");
      setCompanies(data);
    } catch (err) {
      console.error("❌ Failed to fetch companies:", err);
      alert("Failed to load companies.");
    }
  };

  // Fetch student registrations
  const fetchRegistered = async () => {
    try {
      const { data } = await api.get("/placements/my-registrations");
      setRegisteredCompanies(data.map((r) => r.company_id));
    } catch (err) {
      console.error("❌ Failed to fetch registrations:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchRegistered();
  }, []);

  const handleRegister = async (company_id) => {
    if (!window.confirm("Are you sure you want to register for this drive?")) return;
    setLoading(true);
    try {
      await api.post("/placements/register", { company_id });
      alert("✅ Successfully registered for the drive!");
      fetchRegistered(); // refresh list
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          🏢 Available Placement Drives
        </h1>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border border-gray-200 text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="p-3 border">Company</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">CTC (LPA)</th>
                <th className="p-3 border">Drive Date</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.length > 0 ? (
                companies.map((c) => (
                  <tr key={c.company_id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-3 border">{c.name}</td>
                    <td className="p-3 border">{c.role}</td>
                    <td className="p-3 border">{c.ctc}</td>
                    <td className="p-3 border">{c.drive_date || "TBA"}</td>
                    <td className="p-3 border text-center">
                      {registeredCompanies.includes(c.company_id) ? (
                        <button
                          disabled
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded shadow-md cursor-not-allowed opacity-70"
                        >
                          ✅ Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(c.company_id)}
                          disabled={loading}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md"
                        >
                          Register
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No drives available right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
