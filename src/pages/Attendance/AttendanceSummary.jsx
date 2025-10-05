import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const AttendanceSummary = () => {
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get("/attendance/summary");
      setSummary(data);
    } catch (err) {
      alert("Failed to fetch summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance Summary</h1>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Semester</th>
              <th className="p-2 border">Subject</th>
              <th className="p-2 border">Avg Attendance (%)</th>
              <th className="p-2 border">Students Count</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{row.semester}</td>
                <td className="p-2 border">{row.subject_name}</td>
                <td className="p-2 border">{row.avg_attendance}</td>
                <td className="p-2 border">{row.students_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceSummary;
