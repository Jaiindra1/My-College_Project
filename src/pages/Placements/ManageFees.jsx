import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const ManageFees = () => {
  const [form, setForm] = useState({ roll_no: "", amount: "", paid: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.roll_no || !form.amount) {
      alert("⚠️ Please fill in all required fields (Roll No & Amount).");
      return;
    }

    setLoading(true);
    try {
      await api.post("/placements/fee", form); // Backend accepts roll_no
      alert("✅ Placement fee saved successfully!");
      setForm({ roll_no: "", amount: "", paid: "" }); // Reset form
    } catch (err) {
      console.error("❌ Error saving fee:", err);
      alert(err.response?.data?.error || "Failed to save fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            💰 Manage Placement Fees
          </h1>

          {/* Roll No */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              🎓 Student Roll Number
            </label>
            <input
              type="text"
              name="roll_no"
              value={form.roll_no}
              onChange={handleChange}
              placeholder="Enter Roll No (e.g. 22CSE001)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              💲 Total Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter total placement fee"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Paid */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
              💵 Paid Amount
            </label>
            <input
              type="number"
              name="paid"
              value={form.paid}
              onChange={handleChange}
              placeholder="Enter amount already paid"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-white 
              ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"} 
              transition-all duration-200 shadow-md`}
          >
            {loading ? "Saving..." : "💾 Save Fee Record"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ManageFees;
