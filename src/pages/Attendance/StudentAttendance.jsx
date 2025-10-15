import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function StudentAttendance() {
  const navigate = useNavigate();
  const StudentDataa = localStorage.getItem("studentProfile");
  const studentId = StudentDataa ? JSON.parse(StudentDataa).student_id : null;
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Fetch summary & subjects on load
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [summaryRes, subjectRes] = await Promise.all([
          api.get(`/attendance/student/${studentId}/summary`),
          api.get(`/attendance/student/${studentId}/subjects`),
        ]);
        setSummary(summaryRes.data);
        setSubjects(subjectRes.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading attendance:", err);
        setLoading(false);
      }
    };
    if (studentId) fetchAttendance();
  }, [studentId]);

  // ✅ Fetch calendar data
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const subjectParam =
          selectedSubject !== "all" ? `&subject_id=${selectedSubject}` : "";
        const { data } = await api.get(
          `/attendance/student/${studentId}/calendar?month=${month}${subjectParam}`
        );
        setCalendar(data);
      } catch (err) {
        console.error("❌ Failed to load calendar:", err);
      }
    };
    if (studentId) fetchCalendar();
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
    <div className="font-display bg-background-light dark:bg-background-dark text-black dark:text-white min-h-screen flex flex-col">
      {/* ✅ Header (Desktop) */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="text-primary size-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold">Academics</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="/student" className="hover:text-primary text-sm font-medium">
                Dashboard
              </a>
              <a
                href="/student/attendance"
                className="text-sm font-bold text-primary transition-colors"
              >
                Attendance
              </a>
              <a href="/student/notifications" className="hover:text-primary text-sm font-medium">
                Notifications
              </a>
              <a href="/student/placements" className="hover:text-primary text-sm font-medium">
                Placements
              </a>
              <a href="/student/exams" className="hover:text-primary text-sm font-medium">
                Exams & Results
              </a>
              <a href="/student/analytics" className="hover:text-primary text-sm font-medium">
                Analytics
              </a>
              <a href="/student/helpdesk" className="hover:text-primary text-sm font-medium">
                HelpDesk
              </a>
              <a href="/student/fee" className="hover:text-primary text-sm font-medium">
                Fee
              </a>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ✅ Mobile Sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transform transition-transform duration-300 ease-in-out">
              <StudentSidebar
                name={JSON.parse(StudentDataa)?.name}
                rollNo={JSON.parse(StudentDataa)?.roll_no}
                onLogout={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </div>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">🎓 Attendance</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-primary/10 transition-all"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M4 12h16m-7 6h7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Main Content */}
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

        {/* ✅ Subject Table + Calendar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Subject-wise Table */}
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

          {/* Calendar */}
          <div className="flex-shrink-0 lg:w-96">
            <h3 className="text-xl font-bold mb-4">Attendance Calendar</h3>
            <div className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark shadow-sm">
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
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
                  const dateStr = `2025-${String(month).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`;
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
