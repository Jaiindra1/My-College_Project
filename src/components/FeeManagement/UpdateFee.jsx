import React, { useState } from "react";
import axios from "axios";

const UpdateFee = () => {
  const [rollNo, setRollNo] = useState("");
  const [paid, setPaid] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdatedInfo(null);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/fees/update-by-roll",
        { roll_no: rollNo, paid: Number(paid) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Fee updated successfully");
      setUpdatedInfo(res.data);
      setRollNo("");
      setPaid("");
    } catch (err) {
      console.error("❌ Error updating fee:", err);
      alert(
        err.response?.data?.error || "❌ Failed to update fee. Check console."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 flex items-center justify-center">
      <div className="bg-white dark:bg-background-dark/50 rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          💰 Update Fee (By Roll No)
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roll No */}
          <input
            type="text"
            placeholder="Enter Roll Number"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-background-dark/50
                       text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />

          {/* Paid Amount */}
          <input
            type="number"
            placeholder="Enter Paid Amount"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-background-dark/50
                       text-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg 
                       hover:bg-primary/90 focus:ring-2 focus:ring-primary transition-colors"
          >
            ✅ Update Fee
          </button>
        </form>

        {/* Show Result */}
        {updatedInfo && (
          <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/40">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              🎉 Update Result
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Student:</strong> {updatedInfo.student.name} (
              {updatedInfo.student.roll_no})
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Paid:</strong> ₹{updatedInfo.paid}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Total Amount:</strong> ₹{updatedInfo.total_amount}
            </p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  updatedInfo.status === "Paid"
                    ? "bg-green-600"
                    : updatedInfo.status === "Partial"
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
              >
                {updatedInfo.status}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateFee;
