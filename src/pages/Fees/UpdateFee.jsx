import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const UpdateFee = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ paid: "", status: "" });
  const navigate = useNavigate();

  const fetchFee = async () => {
    try {
      const { data } = await api.get(`/fees/${id}`);
      setForm({ paid: data.paid, status: data.status });
    } catch (err) {
      alert("Failed to fetch fee record");
    }
  };

  useEffect(() => {
    fetchFee();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/fees/${id}`, form);
      alert("Fee record updated successfully");
      navigate("/fees");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update fee record");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Update Fee</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="paid"
            placeholder="Paid Amount"
            value={form.paid}
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <select
            name="status"
            value={form.status}
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded"
          >
            Update Fee
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFee;
