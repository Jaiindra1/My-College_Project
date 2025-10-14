import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StudentAttendance() {
  const StudentDataa = localStorage.getItem("attendanceRecords"); // assuming JWT decoded or stored
  const studentId = StudentDataa ? JSON.parse(StudentDataa).userId : null;
  console.log("Student ID:", studentId);
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  // Fetch summary & subjects on load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [summaryRes, subjectRes] = await Promise.all([
          api.get(`/attendance/student/${studentId}/summary`),
          api.get(`/attendance/student/${studentId}/subjects`)
        ]);
        setSummary(summaryRes.data);
        setSubjects(subjectRes.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading attendance:", err);
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [studentId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/");
  };
  // Fetch calendar data
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const subjectParam = selectedSubject !== "all" ? `&subject_id=${selectedSubject}` : "";
        const { data } = await api.get(
          `/attendance/student/${studentId}/calendar?month=${month}${subjectParam}`
        );
        setCalendar(data);
      } catch (err) {
        console.error("❌ Failed to load calendar:", err);
      }
    };
    fetchCalendar();
  }, [studentId, month, selectedSubject]);

  const getDateStatus = (date) => {
    const entry = calendar.find((c) => c.date === date);
    return entry ? entry.status : null;
  };

  const generateMonthDays = () => {
    const year = new Date().getFullYear();
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  if (loading) {
  return (
    <div className="p-8 text-center">
      <p>⏳ Loading attendance data...</p>
    </div>
  );
}


  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-black dark:text-white min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Academics</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="/student" className="hover:text-primary">Dashboard</a>
          <a className="text-sm font-bold text-primary transition-colors" href="/student/attendance">Attendance</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/notifications">Notifications</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/attendance">Attendance</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/placements">Placements</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/exams">Exams & Results</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/analytics">Analytics</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/helpdesk">HelpDesk</a>
          <a className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary transition-colors" href="/student/fee">Fee</a>
          <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Logout
              </button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold">Attendance</h2>
            <p className="text-black/60 dark:text-white/60">
              Track your attendance across all subjects
            </p>
          </div>
          <div className="rounded-lg p-4 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center min-w-[200px]">
            <p className="text-sm font-medium">Overall Attendance</p>
            <p className="text-4xl font-bold text-green-500">
              {summary?.overall_percentage || 0}%
            </p>
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-4">Subject-wise Attendance</h3>
            <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
              <table className="w-full text-left">
                <thead className="border-b border-black/10 dark:border-white/10">
                  <tr>
                    <th className="p-4 text-sm font-semibold">Subject</th>
                    <th className="p-4 text-sm font-semibold">Present/Total</th>
                    <th className="p-4 text-sm font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.subject_id} className="border-b border-black/10 dark:border-white/10">
                      <td className="p-4">{s.subject_name}</td>
                      <td className="p-4">{s.attended}/{s.total}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${s.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{s.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="flex-shrink-0 lg:w-96">
  <h3 className="text-xl font-bold mb-4">Attendance Calendar</h3>
  <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark shadow-sm">
    {/* Top Controls */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
        {/* Month Selector */}
        <select
          className="form-select w-full rounded border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary text-sm"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en-US", { month: "long" })}
            </option>
          ))}
        </select>

        {/* Subject Selector */}
        <select
          className="form-select w-full rounded border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary text-sm"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>
      </div>

      {/* Month Navigation Arrows */}
      <div className="flex items-center">
        <button
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onClick={() => setMonth((prev) => (prev > 1 ? prev - 1 : 12))}
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onClick={() => setMonth((prev) => (prev < 12 ? prev + 1 : 1))}
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>

    {/* Calendar Grid */}
    <div className="grid grid-cols-7 gap-1 text-center text-sm">
      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
        <div
          key={d}
          className="font-semibold text-black/60 dark:text-white/60"
        >
          {d}
        </div>
      ))}

      {generateMonthDays().map((day) => {
        const dateStr = `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const status = getDateStatus(dateStr);
        const className =
          status === "P"
            ? "bg-green-500/20 text-green-500 rounded-full"
            : status === "A"
            ? "bg-red-500/20 text-red-500 rounded-full"
            : "text-black/60 dark:text-white/60";

        return (
          <div key={day} className={`p-2 ${className}`}>
            {day}
          </div>
        );
      })}
    </div>
  </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
