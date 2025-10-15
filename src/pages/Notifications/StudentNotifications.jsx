import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function StudentNotifications() {
  const navigate = useNavigate();
  const studentData = JSON.parse(localStorage.getItem("studentData")) || JSON.parse(localStorage.getItem("studentProfile"));
  const studentId = studentData?.student_id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentData");
    localStorage.removeItem("studentProfile");
    navigate("/");
  };

  // ✅ Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get(`/notifications/student/${studentId}`);
        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchNotifications();
  }, [studentId]);

  // ✅ Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/mark-read/${studentId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("❌ Failed to mark as read", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20 text-gray-500">
        ⏳ Loading notifications...
      </div>
    );

  return (
    <div className="font-display text-gray-800 dark:text-gray-200 bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      {/* ✅ Header (Desktop) */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Academics Hub</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">Dashboard</a>
            <a href="/student/attendance" className="hover:text-primary">Attendance</a>
            <a href="/student/notifications" className="text-primary font-bold">Notifications</a>
            <a href="/student/placements" className="hover:text-primary">Placements</a>
            <a href="/student/exams" className="hover:text-primary">Exams</a>
            <a href="/student/analytics" className="hover:text-primary">Analytics</a>
            <a href="/student/helpdesk" className="hover:text-primary">HelpDesk</a>
            <a href="/student/fee" className="hover:text-primary">Fee</a>
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
            {/* Sidebar Drawer */}
            <div className="h-full w-3/4 bg-card-light dark:bg-card-dark shadow-lg transform transition-transform duration-300 ease-in-out">
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
          <h1 className="text-lg font-bold text-primary">🔔 Notifications</h1>
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
      <main className="container mx-auto px-6 py-8 max-w-4xl flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h2 className="text-3xl font-bold mb-2 md:mb-0">Notifications</h2>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
          >
            Mark all as read
          </button>
        </div>

        <div className="bg-white dark:bg-background-dark/50 rounded-lg shadow-sm">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500">No notifications yet 🎉</p>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.notification_id}
                  className={`p-4 transition-colors duration-200 ${
                    n.is_read
                      ? "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      : "bg-primary/10 hover:bg-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {!n.is_read ? (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 shrink-0"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 opacity-0 rounded-full mt-1.5 shrink-0"></div>
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <p
                          className={`${
                            n.is_read
                              ? "font-medium text-gray-700 dark:text-gray-300"
                              : "font-bold text-gray-900 dark:text-white"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500">{n.date}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
  