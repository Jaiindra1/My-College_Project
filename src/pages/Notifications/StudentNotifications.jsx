import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function StudentNotifications() {
  const student = JSON.parse(localStorage.getItem("studentData"));
  const studentId = student?.student_id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get(`/notifications/student/${studentId}`);
        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [studentId]);

  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/mark-read/${studentId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("❌ Failed to mark as read", err);
    }
  };

  if (loading)
    return <div className="flex justify-center mt-20 text-gray-500">Loading notifications...</div>;

  return (
    <div className="font-display text-gray-800 dark:text-gray-200 bg-background-light dark:bg-background-dark min-h-screen">
      <header className="bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M47.24 24L24 47.24 0.76 24 24 0.76 47.24 24ZM12.24 21H35.76L24 9.24 12.24 21Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Academics Hub</h1>
          </div>

          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">Notifications</h2>

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
