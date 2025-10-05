import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeeListManagement = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/fees/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching fees', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">📊 Pending Fees</h2>
      <table className="w-full border-collapse rounded-xl overflow-hidden shadow-lg">
  <thead>
    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm uppercase tracking-wide">
      <th className="px-6 py-3 text-left">Roll No</th>
      <th className="px-6 py-3 text-left">Student</th>
      <th className="px-6 py-3 text-center">Semester</th>
      <th className="px-6 py-3 text-center">Amount</th>
      <th className="px-6 py-3 text-center">Paid</th>
      <th className="px-6 py-3 text-center">Status</th>
    </tr>
  </thead>
  <tbody>
    {fees.map((fee, idx) => (
      <tr
        key={fee.fee_id}
        className={`transition-colors duration-200 hover:bg-blue-50 ${
          idx % 2 === 0 ? "bg-[#fefaf6]" : "bg-[#fdfcf9]"
        }`}
      >
        {/* Roll No */}
        <td className="px-6 py-3 font-semibold text-blue-700">
          {fee.roll_no || `#${fee.student_id}`}
        </td>

        {/* Student Name */}
        <td className="px-6 py-3 font-medium text-emerald-700">
          {fee.student_name || "—"}
        </td>

        {/* Semester */}
        <td className="px-6 py-3 text-center font-medium text-indigo-700">
          Sem {fee.sem_id}
        </td>

        {/* Amount */}
        <td className="px-6 py-3 text-center font-semibold text-orange-600">
          ₹{fee.amount}
        </td>

        {/* Paid */}
        <td className="px-6 py-3 text-center font-semibold text-cyan-700">
          ₹{fee.paid}
        </td>

        {/* Status */}
        <td className="px-6 py-3 text-center">
          {fee.status === "Paid" ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shadow-sm">
              ✅ Paid
            </span>
          ) : fee.status === "Partial" ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 shadow-sm">
              ⚠️ Partial
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 shadow-sm">
              ⛔ Pending
            </span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default FeeListManagement;
