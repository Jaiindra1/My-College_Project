import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const AttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ student_id: "", subject_id: "", month: "" });

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get("/attendance");
      setRecords(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attendance records");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filtered = records.filter(r =>
    (!filters.student_id || r.student_id.toString().includes(filters.student_id)) &&
    (!filters.subject_id || r.subject_id.toString().includes(filters.subject_id)) &&
    (!filters.month || r.month.includes(filters.month))
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Filter by Student ID"
            value={filters.student_id}
            onChange={e => setFilters({ ...filters, student_id: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Filter by Subject ID"
            value={filters.subject_id}
            onChange={e => setFilters({ ...filters, subject_id: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Filter by Month (YYYY-MM)"
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}
            className="border p-2 rounded"
          />
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Student ID</th>
              <th className="p-2 border">Subject ID</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Total Classes</th>
              <th className="p-2 border">Attended</th>
              <th className="p-2 border">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="p-2 border">{r.id}</td>
                <td className="p-2 border">{r.student_id}</td>
                <td className="p-2 border">{r.subject_id}</td>
                <td className="p-2 border">{r.month}</td>
                <td className="p-2 border">{r.total_classes}</td>
                <td className="p-2 border">{r.attended_classes}</td>
                <td className="p-2 border">
                  {((r.attended_classes / r.total_classes) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
