import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function FeeManagement() {
  const studentData = JSON.parse(localStorage.getItem("studentProfile"));
  const studentId = studentData?.student_id;
  const [fees, setFees] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/fees/student/${studentId}`);
        console.log("✅ Fee Data:", data);

        // ✅ Handle both array or object responses
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
    fetchFees();
  }, [studentId]);

  if (loading) return <div className="p-6 text-center">Loading Fee Details...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-background-light dark:bg-background-dark min-h-screen text-gray-800 dark:text-gray-200">
      <header className="flex items-center justify-between border-b border-primary/20 dark:border-primary/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary">
            account_balance_wallet
          </span>
          <h1 className="text-2xl font-bold">Fee Management</h1>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Semester Fees</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Semester", "Fee Type", "Amount", "Paid", "Balance", "Status"].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
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
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm">{f.sem || f.sem_id}</td>
                      <td className="px-6 py-4 text-sm">{f.fee_type}</td>
                      <td className="px-6 py-4 text-sm">₹{f.amount}</td>
                      <td className="px-6 py-4 text-sm">₹{f.paid}</td>
                      <td className="px-6 py-4 text-sm">₹{balance}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            f.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : f.status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
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
                  <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                    No fee records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {["Date", "Semester", "Fee Type", "Paid Amount", "Mode", "Status"].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm">{h.payment_date || "—"}</td>
                    <td className="px-6 py-4 text-sm">{h.sem || h.sem_id || "—"}</td>
                    <td className="px-6 py-4 text-sm">{h.fee_type}</td>
                    <td className="px-6 py-4 text-sm">₹{h.paid || 0}</td>
                    <td className="px-6 py-4 text-sm">{h.payment_mode || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          h.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                    No payment history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
