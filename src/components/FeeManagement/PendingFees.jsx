import React, { useEffect, useState } from "react";
import axios from "axios";
import { data } from "autoprefixer";
import api from "../../api/axiosInstance";

const PendingFees = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Fetch Pending Fees
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get("/fees/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(res.data);
      console.log(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching pending fees", err);
      setLoading(false);
    }
  };

  // 🔍 Search by Roll No or Student ID
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      pending.filter(
        (f) =>
          f.student_id.toString().includes(value) ||
          (f.roll_no && f.roll_no.toLowerCase().includes(value))
      )
    );
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading Pending Fees...
      </p>
    );

  return (
    <div className="p-6 bg-background-light dark:bg-background-dark min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-Black mb-6 text-center">
         Pending Fee Records
      </h2>

      {/* 🔍 Search Box */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Search by Roll No or Student ID..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                     text-gray-800 dark:text-gray-200
                     bg-white dark:bg-background-dark/50
                     focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* 📊 Table */}
      {filtered.length === 0 ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          🎉 No pending fees found
        </p>
      ) : (
        <div className="bg-white dark:bg-background-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs uppercase tracking-wide">
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3 text-center">Semester</th>
                <th className="px-6 py-3 text-center">Fee Type</th>
                <th className="px-6 py-3 text-center">Total Amount</th>
                <th className="px-6 py-3 text-center">Paid</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>

              {/* Table Body */}
                <tbody className="text-center">
                  {filtered.map((fee, idx) => {
                    const remaining = fee.amount - fee.paid;
                    const status = remaining > 0 ? "Pending" : "Cleared";
                    return (
                      <tr
                        key={fee.student_id + "-" + idx}
                        className={`border-b border-primary/20 transition-colors duration-200 hover:bg-blue-100 ${
                          idx % 2 === 0
                            ? "bg-[#fdfcf9] " // ✨ warm tone for even rows
                            : "bg-[#f8fafc] " // ✨ cool tone for odd rows
                        }`}
                      >
                        {/* Student Name */}
                        <td className="px-6 py-4 font-bold text-primary dark:text-blue-800">
                          {fee.student_name}
                        </td>

                        {/* Roll No */}
                        <td className="px-6 py-4 font-medium text-emerald-800 dark:text-emerald-800">
                          {fee.roll_no || "—"}
                        </td>

                        {/* semester */}
                        <td className="px-6 py-4 font-medium text-emerald-800 dark:text-emerald-800">
                          {fee.semester || "—"}
                        </td>

                        {/* Semester */}
                        <td className="px-6 py-4 text-center font-medium text-indigo-700 dark:text-indigo-800">
                         {fee.fee_type}
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 text-center font-semibold text-orange-600 dark:text-orange-800">
                          ₹{fee.amount}
                        </td>

                        {/* Paid */}
                        <td className="px-6 py-4 text-center font-semibold text-cyan-700 dark:text-cyan-800">
                          ₹{fee.paid}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-6 m-5 text-center">
                          {status === "Pending" ? (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-400 text-red-800 dark:bg-Yellow-500/40 dark:text-black shadow-sm">
                              Pending (₹{remaining})
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm">
                              Cleared
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default PendingFees;
