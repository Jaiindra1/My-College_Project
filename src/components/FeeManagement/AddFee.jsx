import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function AddFee() {
  const [formData, setFormData] = useState({
    roll_no: "",
    sem_id: "",
    amount: "",
    paid: "",
    fee_type: "SEM_FEE",
    payment_mode: "Cash",
    remarks: "",
  });

  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all semesters to populate dropdown
  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/semesters"); // ✅ Backend must have GET /semesters
        setSemesters(data);
      } catch (err) {
        console.error("❌ Failed to fetch semesters:", err);
        alert("Could not load semesters");
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roll_no || !formData.sem_id || !formData.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/fees", formData);
      alert("✅ Fee added successfully!");
      setFormData({
        roll_no: "",
        sem_id: "",
        amount: "",
        paid: "",
        fee_type: "SEM_FEE",
        payment_mode: "Cash",
        remarks: "",
      });
    } catch (err) {
      console.error("❌ Error adding fee:", err);
      alert(err.response?.data?.error || "Failed to add fee");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
        ➕ Add New Fee Record
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Roll No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student Roll No
          </label>
          <input
            type="text"
            name="roll_no"
            value={formData.roll_no}
            onChange={handleChange}
            placeholder="Enter Roll Number"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Semester Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Semester
          </label>
          <select
            name="sem_id"
            value={formData.sem_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem.sem_id} value={sem.sem_id}>
                Year {sem.year} - Sem {sem.sem}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Total Fee"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Paid Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Paid Amount
          </label>
          <input
            type="number"
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            placeholder="Enter Paid Amount"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Mode
          </label>
          <select
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
            <option value="Card">Card</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition"
        >
          ➕ Add Fee
        </button>
      </form>
    </div>
  );
}
