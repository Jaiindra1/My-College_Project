import React, { useState } from "react";
import api from "../../api/axiosInstance";

const UpdateFee = () => {
  const [rollNo, setRollNo] = useState("");
  const [paid, setPaid] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState(null);
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdatedInfo(null);
    try {
      const res = await api.put(
        "/fees/update-by-roll",
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
  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students/");
      setStudents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };
  
  return (
    <div className=" bg-gray-100 flex justify-center pt-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl text-center font-bold text-black mb-6">
          Update Fee - By Roll No
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Roll No */}
          <input
            type="text"
            placeholder="Enter Roll Number"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-black text-base
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />

          {/* Paid Amount */}
          <input
            type="number"
            placeholder="Enter Paid Amount"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-black text-base
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg 
                       hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-colors shadow-md"
          >
            ✅ Update Fee
          </button>
        </form>

        {/* Show Result */}
        {updatedInfo && (
          <div className="mt-8 p-4 rounded-lg border border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-black mb-2">
              🎉 Update Result
            </h3>
            <p className="text-sm text-gray-700">
              <strong>Student:</strong> {updatedInfo.student.name} (
              {updatedInfo.student.roll_no})
            </p>
            <p className="text-sm text-gray-700">
              <strong>Paid:</strong> ₹{updatedInfo.paid}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Total Amount:</strong> ₹{updatedInfo.total_amount}
            </p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
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
