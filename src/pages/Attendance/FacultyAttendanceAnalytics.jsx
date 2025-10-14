import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const FacultyAttendanceAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/attendance/faculty/attendance-analytics${month ? `?month=${month}` : ""}`
      );
      setAnalytics(data.analytics || []);
    } catch (err) {
      console.error("❌ Analytics fetch error:", err);
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [month]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          📊 Faculty Attendance Analytics
        </h1>

        <div className="flex justify-between items-center mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {new Date(2025, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : analytics.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {analytics.map((item) => (
              <div
                key={item.subject_id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {item.subject_name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-3">
                  Avg Attendance:{" "}
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {item.avg_attendance}%
                  </span>
                </p>

                <div className="border-t pt-3">
                  <h3 className="text-sm font-semibold mb-2">
                    👑 Top Performing Students:
                  </h3>
                  <ul className="text-sm">
                    {item.top_students.length > 0 ? (
                      item.top_students.map((s, i) => (
                        <li key={i}>
                          {s.roll_no} - {s.student_name} (
                          <span className="text-green-600">{s.percentage}%</span>)
                        </li>
                      ))
                    ) : (
                      <li>No data</li>
                    )}
                  </ul>
                </div>

                <div className="mt-3 text-sm text-red-600">
                  ⚠️ {item.low_attendance} students below 75%
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyAttendanceAnalytics;
