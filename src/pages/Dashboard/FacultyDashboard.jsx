import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultySidebar from "../../components/FacultySidebar";
import api from "../../api/axiosInstance";

export default function FacultyDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Safe User Fetch
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.user_id;
    } catch {
      return null;
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const facultyId = getUserId();
    if (!facultyId) {
      console.warn("⚠️ No faculty user found in localStorage");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [facultyRes, scheduleRes, attendanceRes, notifyRes] = await Promise.all([
          api.get(`/faculty/${facultyId}`),
          api.get(`/faculty/${facultyId}/timetable`),
          api.get(`/faculty/${facultyId}/attendance-summary`),
          api.get(`/notifications/faculty`),
        ]);

        // ✅ Normalize responses
        setFaculty(facultyRes.data || {});
        setSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);

        const summaryData = attendanceRes.data;
        if (Array.isArray(summaryData)) {
          setAttendanceSummary(summaryData);
        } else if (summaryData && Array.isArray(summaryData.attendance_summary)) {
          setAttendanceSummary(summaryData.attendance_summary);
        } else if (summaryData) {
          setAttendanceSummary([summaryData]);
        } else {
          setAttendanceSummary([]);
        }

        setNotifications(Array.isArray(notifyRes.data) ? notifyRes.data : []);
      } catch (err) {
        console.error("❌ Faculty Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Faculty Dashboard...
      </div>
    );
  }

  // 🧮 Compute average attendance safely
  const averageAttendance =
    Array.isArray(attendanceSummary) && attendanceSummary.length > 0
      ? (
          attendanceSummary.reduce((sum, a) => sum + (a.percentage || 0), 0) /
          attendanceSummary.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar for mobile/desktop */}
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Section */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-primary/20 dark:border-primary/30 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-40">
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle for Mobile */}
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full text-black/70 dark:text-white/70 hover:bg-primary/10 dark:hover:bg-primary/20 md:hidden"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold text-black dark:text-white">
              Faculty Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-black/70 dark:text-white/70 hover:bg-primary/10 dark:hover:bg-primary/20 relative">
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button onClick={() => navigate('/faculty/FacultyProfile')} className="w-10 h-10 rounded-full overflow-hidden">
              <img
                alt="Faculty Avatar"
                className="w-full h-full rounded-full object-cover"
                src={faculty?.picture || "https://lh3.googleusercontent.com/aida-public/AB6AXuAat3m8eIfH3Mttu0dw8hTAYE5mEaxCde6Qf2B50Xo2WDJCWUbZ2NCqzNvABuAOMBWS8jr93AWRje7XR8hdSpva2fYLHb_lWiLLUIdOjbIZ5JAdRaQTJOPBuabmGXvbvxKR5QIlibvadkSmahyLRKaAXunvf87D1dmM2UdgkTIbVzeOhf86R_8m56LtTcadIDYs3RPryyS6fa3WOuyTn_hXA-KxyUt3r6wlZC3znF8XSBGKVwXb54by3xLCiYuBGeEwbWXjQPAwbS4"}
              />
            </button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">
              Welcome back, {faculty?.name || "Professor"}
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Department of {faculty?.department_name || "IT"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Classes Assigned", value: faculty?.subject_count || 0 },
              { title: "Students Enrolled", value: faculty?.student_count || 0 },
              {
                title: "Attendance Pending",
                value: Array.isArray(attendanceSummary)
                  ? attendanceSummary.filter((a) => a.percentage < 80).length
                  : 0,
              },
              { title: "Avg Attendance %", value: `${averageAttendance}%` },
            ].map((stat) => (
              <div
                key={stat.title}
                className="bg-primary/10 dark:bg-primary/20 p-6 rounded-xl"
              >
                <p className="text-base font-medium text-black dark:text-white">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="/faculty/FacultyAttendance"
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
              >
                Take Attendance
              </a>
              <a
                href="/faculty/FacultyAttendanceAnalytics"
                className="px-6 py-2 bg-primary/20 dark:bg-primary/30 text-primary font-bold rounded-lg hover:bg-primary/30 dark:hover:bg-primary/40"
              >
                View Attendance Analytics
              </a>
              <button className="px-6 py-2 bg-primary/10 dark:bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/20">
                Upload Exam Paper
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Today’s Schedule */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm w-90 max-w-sm mx-auto">
              <h2 className="text-xl font-bold mb-4">📅 Today’s Schedule</h2>
              {schedule.length > 0 ? (
                <table className="w-full text-left border">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="p-2 border">Period</th>
                      <th className="p-2 border">Subject</th>
                      <th className="p-2 border">Semester</th>
                      <th className="p-2 border">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr
                        key={row.period_no}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-2 border text-center">{row.period_no}</td>
                        <td className="p-2 border">{row.subject_name}</td>
                        <td className="p-2 border">{row.semester}</td>
                        <td className="p-2 border">
                          {row.start_time} - {row.end_time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No classes scheduled today.</p>
              )}
            </div>
            {/* Attendance Summary */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm w-90 max-w-sm mx-auto">
              <h2 className="text-xl font-bold mb-4">📊 Attendance Summary</h2>
              {Array.isArray(attendanceSummary) && attendanceSummary.length > 0 ? (
                attendanceSummary.map((item) => (
                  <div key={item.subject_id} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.subject_name}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
                      <div
                        className="h-2 bg-primary rounded"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No attendance records yet.</p>
              )}
            </div>
            {/* Notifications Section */}
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm w-90 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">🔔 Recent Notifications</h2>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.notification_id} className="border-b pb-2">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent notifications.</p>
            )}
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}
