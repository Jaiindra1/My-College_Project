import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFees = async () => {
    try {
      const { data } = await api.get("/fees");
      setFees(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch fees data");
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const filteredFees = fees.filter(
    (fee) =>
      fee.student_id.toString().includes(search) ||
      fee.sem_id.toString().includes(search)
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Fee Records</h1>
          <Link
            to="/fees/add"
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Add Fee Record
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search by Student ID or Semester"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4 rounded w-1/3"
        />

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Fee ID</th>
              <th className="p-2 border">Student ID</th>
              <th className="p-2 border">Semester</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Paid</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee) => (
              <tr key={fee.fee_id}>
                <td className="p-2 border">{fee.fee_id}</td>
                <td className="p-2 border">{fee.student_id}</td>
                <td className="p-2 border">{fee.sem_id}</td>
                <td className="p-2 border">{fee.amount}</td>
                <td className="p-2 border">{fee.paid}</td>
                <td className="p-2 border">{fee.status}</td>
                <td className="p-2 border">
                  <Link
                    to={`/fees/update/${fee.fee_id}`}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeList;
