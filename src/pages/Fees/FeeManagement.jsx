import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import StudentSidebar from "../../components/StudentSidebar";

export default function FeeManagement() {

  const studentData = JSON.parse(localStorage.getItem("studentProfile"));
  const studentId = studentData?.student_id;

  const navigate = useNavigate();
  const studentData =
    JSON.parse(localStorage.getItem("studentProfile")) ||
    JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentData?.student_id;

  const [fees, setFees] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  // ✅ Fetch Fee Details
  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get(`/fees/student/${studentId}`);
        console.log("✅ Fee Data:", data);

        if (Array.isArray(data)) {
          setFees(data);
          setHistory([]);
        } else {
          setFees(data.fees || []);
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch fees:", err);
        setError("Failed to load fee information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchFees();
  }, [studentId]);

  // ✅ Loading and Error States
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading Fee Details...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* ✅ Desktop Header */}
      <header className="bg-card-light dark:bg-card-dark border-b sticky top-0 z-10 hidden md:block">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">
              account_balance_wallet
            </span>
            <h1 className="text-xl font-bold">Fee Management</h1>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="/student" className="hover:text-primary">Dashboard</a>
            <a href="/student/attendance" className="hover:text-primary">Attendance</a>
            <a href="/student/notifications" className="hover:text-primary">Notifications</a>
            <a href="/student/placements" className="hover:text-primary">Placements</a>
            <a href="/student/exams" className="hover:text-primary">Exams</a>
            <a href="/student/analytics" className="hover:text-primary">Analytics</a>
            <a href="/student/helpdesk" className="hover:text-primary">HelpDesk</a>
            <a
              href="/student/fee"
              className="text-primary font-bold border-b-2 border-primary pb-1"
            >
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
          <h1 className="text-lg font-bold text-primary">💰 Fee Management</h1>
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
      <main className="p-8 container mx-auto max-w-6xl w-full flex-1">
        {/* ===== SEMESTER FEES ===== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Semester Fees</h2>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Semester", "Fee Type", "Amount", "Paid", "Balance", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {fees.length > 0 ? (
                  fees.map((f, i) => {
                    const balance = f.amount - (f.paid || 0);
                    return (
                      <tr
                        key={i}
                        className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                      >
                        <td className="px-6 py-4 text-sm">{f.sem || f.sem_id}</td>
                        <td className="px-6 py-4 text-sm">{f.fee_type}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          ₹{f.amount}
                        </td>
                        <td className="px-6 py-4 text-sm">₹{f.paid}</td>
                        <td className="px-6 py-4 text-sm text-yellow-600 dark:text-yellow-400">
                          ₹{balance}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              f.status === "Paid"
                                ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                                : f.status === "Partial"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                                : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white"
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No fee records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== PAYMENT HISTORY ===== */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Payment History</h2>
          <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {["Date", "Semester", "Fee Type", "Paid Amount", "Mode", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.length > 0 ? (
                  history.map((h, i) => (
                    <tr
                      key={i}
                      className="hover:bg-primary/5 dark:hover:bg-primary/10 transition"
                    >
                      <td className="px-6 py-4 text-sm">
                        {new Date(h.payment_date || "").toLocaleDateString() || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">{h.sem || h.sem_id || "—"}</td>
                      <td className="px-6 py-4 text-sm">{h.fee_type}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{h.paid || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">{h.payment_mode || "—"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            h.status === "Paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-white"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white"
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No payment history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
