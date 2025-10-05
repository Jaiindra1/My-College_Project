import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const AddFee = () => {
  const [form, setForm] = useState({
    student_id: "",
    sem_id: "",
    amount: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees", form);
      alert("Fee record added successfully");
      navigate("/fees");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add fee record");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Add Fee Record</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="student_id"
            placeholder="Student ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="sem_id"
            placeholder="Semester ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="amount"
            placeholder="Amount"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded"
          >
            Save Fee Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFee;
