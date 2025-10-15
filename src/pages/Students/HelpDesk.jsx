import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function HelpDesk() {
  const navigate = useNavigate();
  const studentData =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentData?.student_id;

  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  // ✅ Fetch Tickets
  const fetchTickets = async () => {
    try {
      const { data } = await api.get(`/helpdesk/${studentId}`);
      setTickets(data);
    } catch (err) {
      console.error("❌ Failed to load tickets:", err);
    }
  };

  useEffect(() => {
    if (studentId) fetchTickets();
  }, [studentId]);

  // ✅ Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/helpdesk", { ...form, student_id: studentId });
      alert("✅ Ticket submitted successfully!");
      setForm({ subject: "", message: "" });
      fetchTickets();
    } catch (err) {
      console.error("❌ Failed to submit ticket:", err);
      alert("❌ Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* ✅ Desktop Header */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 11c.552 0 1-.448 1-1V5a1 1 0 10-2 0v5c0 .552.448 1 1 1zm.001 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12c0 4.971-4.029 9-9 9S3 16.971 3 12 7.029 3 12 3s9 4.029 9 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">HelpDesk</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">Dashboard</a>
            <a href="/student/attendance" className="hover:text-primary">Attendance</a>
            <a href="/student/notifications" className="hover:text-primary">Notifications</a>
            <a href="/student/placements" className="hover:text-primary">Placements</a>
            <a href="/student/exams" className="hover:text-primary">Exams</a>
            <a href="/student/analytics" className="hover:text-primary">Analytics</a>
            <a
              href="/student/helpdesk"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
              HelpDesk
            </a>
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
            <div
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b">
          <h1 className="text-lg font-bold text-primary">🆘 HelpDesk</h1>
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
      <main className="p-6 container mx-auto max-w-5xl w-full flex-1">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Submit a Ticket
        </h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-md border border-primary/20 dark:border-primary/30 space-y-4 mb-10"
        >
          <input
            placeholder="Subject"
            className="border border-gray-300 dark:border-gray-700 rounded-md p-3 w-full bg-transparent focus:ring-2 focus:ring-primary outline-none"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            placeholder="Describe your issue..."
            className="border border-gray-300 dark:border-gray-700 rounded-md p-3 w-full bg-transparent focus:ring-2 focus:ring-primary outline-none"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-2 px-6 rounded-md font-medium hover:bg-primary/90 disabled:bg-primary/50 transition"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-card-dark rounded-lg shadow-md border border-primary/20 dark:border-primary/30 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-6 text-gray-500 dark:text-gray-400"
                  >
                    No tickets submitted yet 🎉
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr
                    key={t.ticket_id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                  >
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                      {t.subject}
                    </td>
                    <td className="p-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          t.status === "Resolved"
                            ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-white"
                            : "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-white"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-300">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
