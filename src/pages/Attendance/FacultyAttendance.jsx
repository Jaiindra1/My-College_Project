import { useState, useEffect } from "react";
import Sidebar from "../../components/FacultySidebar";
import api from "../../api/axiosInstance";

const FacultyAttendance = () => {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id;
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch subjects handled by logged-in faculty
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get(`/faculty/${facultyId}/subjects`);
        setSubjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to fetch subjects:", err);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [facultyId]);

  // ✅ Fetch students
  const fetchStudents = async () => {
    if (!selectedSubject || !date) return alert("⚠️ Please select subject and date first");
    setLoading(true);
    try {
      const { data } = await api.get(`/attendance/subject/${selectedSubject}/students`);
      setStudents(data);
      setAttendance({});
    } catch (err) {
      console.error("❌ Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle attendance
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === "P" ? "A" : "P",
    }));
  };

  // ✅ Mass controls
  const markAllPresent = () => {
    const all = {};
    students.forEach((s) => (all[s.student_id] = "P"));
    setAttendance(all);
  };

  const markAllAbsent = () => {
    const all = {};
    students.forEach((s) => (all[s.student_id] = "A"));
    setAttendance(all);
  };

  const resetAttendance = () => setAttendance({});

  // ✅ Save attendance
  const handleSubmit = async () => {
    if (!selectedSubject || !date) return alert("Select subject and date first");
    if (!students.length) return alert("No students loaded yet.");
    if (!window.confirm("Are you sure you want to save attendance?")) return;

    const records = students.map((s) => ({
      student_id: s.student_id,
      status: attendance[s.student_id] || "A",
    }));

    try {
      setSaving(true);
      await api.post("/attendance/log", { subject_id: selectedSubject, date, records });
      alert("✅ Attendance saved successfully!");
      resetAttendance();
    } catch (err) {
      console.error("❌ Error saving attendance:", err);
      alert(err.response?.data?.error || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Calculate summary
  const totalStudents = students.length;
  const presentCount = Object.values(attendance).filter((s) => s === "P").length;
  const absentCount = totalStudents - presentCount;
  const percentage = totalStudents ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
          📋 Faculty Attendance Management
        </h1>

        {/* Filter Section */}
        <div className="bg-white/80 dark:bg-black/20 border border-primary/20 dark:border-primary/30 rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border rounded-lg p-2 bg-background-light dark:bg-background-dark text-slate-700 dark:text-slate-200"
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg p-2 bg-background-light dark:bg-background-dark text-slate-700 dark:text-slate-200"
            />

            <button
              onClick={fetchStudents}
              className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition-colors"
            >
              {loading ? "Loading..." : "Load Students"}
            </button>
          </div>
        </div>

        {/* Summary Section */}
        {students.length > 0 && (
          <div className="bg-white dark:bg-slate-900/60 border border-primary/20 dark:border-primary/30 rounded-xl p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              🧾 Attendance Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  {totalStudents}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                  {presentCount}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                  {absentCount}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
                <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                  {percentage}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={markAllPresent}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg"
              >
                Mark All Absent
              </button>
              <button
                onClick={resetAttendance}
                className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Student List Section */}
        {!loading && students.length > 0 && (
          <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-primary/20 dark:border-primary/30 overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-4 border-b border-primary/20 dark:border-primary/30">
              <h2 className="font-bold text-slate-800 dark:text-slate-200">🎓 Student List</h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800 border-b border-primary/20 dark:border-primary/30">
                <tr>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.student_id}
                    className="border-b border-primary/10 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-3">{s.roll_no}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleAttendance(s.student_id)}
                        className={`px-4 py-1 rounded text-white font-semibold ${
                          attendance[s.student_id] === "P"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {attendance[s.student_id] === "P" ? "Present" : "Absent"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 text-right border-t border-primary/20 dark:border-primary/30">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Submit Attendance"}
              </button>
            </div>
          </div>
        )}

        {!loading && students.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            No students loaded yet.
          </p>
        )}
      </main>
    </div>
  );
};

export default FacultyAttendance;
