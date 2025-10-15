import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function UpcomingExams() {
  const navigate = useNavigate();
  const studentData =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData")) ||
    JSON.parse(localStorage.getItem("attendanceRecords"));
  const studentId = studentData?.student_id || studentData?.userId;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    localStorage.removeItem("attendanceRecords");
    navigate("/");
  };

  // ✅ Fetch Exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get(`/exams/upcoming/${studentId}`);
        const today = new Date();

        // Filter future or current month exams only
        const filtered = data.filter((exam) => {
          const examDate = new Date(exam.exam_date);
          return examDate >= new Date(today.getFullYear(), today.getMonth(), 1);
        });

        // Sort by date
        filtered.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

        // Group by Month-Year (e.g. "October 2025")
        const grouped = filtered.reduce((acc, exam) => {
          const date = new Date(exam.exam_date);
          const monthKey = date.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          if (!acc[monthKey]) acc[monthKey] = [];
          acc[monthKey].push(exam);
          return acc;
        }, {});

        setExams(grouped);
      } catch (err) {
        console.error("❌ Failed to load upcoming exams:", err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchExams();
  }, [studentId]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* ✅ Header (Desktop) */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Academics Hub</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">
              Dashboard
            </a>
            <a href="/student/attendance" className="hover:text-primary">
              Attendance
            </a>
            <a href="/student/notifications" className="hover:text-primary">
              Notifications
            </a>
            <a href="/student/placements" className="hover:text-primary">
              Placements
            </a>
            <a
              href="/student/exams"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              Exams
            </a>
            <a href="/student/analytics" className="hover:text-primary">
              Analytics
            </a>
            <a href="/student/helpdesk" className="hover:text-primary">
              HelpDesk
            </a>
            <a href="/student/fee" className="hover:text-primary">
              Fee
            </a>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* ✅ Mobile Sidebar */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Drawer */}
            <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transition-transform duration-300 ease-in-out">
              <StudentSidebar
                name={studentData?.name}
                rollNo={studentData?.roll_no}
                onLogout={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </div>
            {/* Overlay */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">🧾 Upcoming Exams</h1>
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

      {/* ✅ Main Section */}
      <main className="px-6 py-8 flex-1 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Exams & Results
          </h2>

          <div className="border-b border-primary/20 mb-8">
            <nav className="-mb-px flex space-x-8">
              <a
                href="/student/exams"
                className="border-b-2 border-primary text-primary px-1 py-4 text-sm font-medium"
              >
                Upcoming Exams
              </a>
              <a
                href="/student/results"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-1 py-4 text-sm font-medium"
              >
                Results
              </a>
            </nav>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-500">
              Loading exams...
            </div>
          ) : Object.keys(exams).length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No upcoming exams 🎉
            </div>
          ) : (
            Object.entries(exams).map(([month, monthExams]) => (
              <div key={month} className="mb-10">
                <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    calendar_month
                  </span>
                  {month}
                </h3>
                <div className="overflow-hidden rounded-lg border border-primary/20 bg-white dark:bg-gray-800 shadow">
                  <table className="w-full divide-y divide-primary/20 dark:divide-primary/30 table-auto">
                    <thead className="bg-gray-50 dark:bg-primary/10">
                      <tr>
                        {["Exam", "Date", "Time", "Subject"].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/20 bg-white dark:divide-primary/30 dark:bg-background-dark">
                      {monthExams.map((exam, index) => (
                        <tr
                          key={index}
                          className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {exam.exam_type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {new Date(exam.exam_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {exam.exam_time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {exam.subject_name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
