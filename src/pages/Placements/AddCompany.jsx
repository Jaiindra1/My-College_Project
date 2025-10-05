import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const AddCompany = () => {
  const [form, setForm] = useState({ name: "", role: "", ctc: "", drive_date: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/placements/company", form);
      alert("Company drive added successfully");
      navigate("/placements");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add company");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Add Company Drive</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Company Name" className="border p-2 rounded" onChange={handleChange} />
          <input name="role" placeholder="Role" className="border p-2 rounded" onChange={handleChange} />
          <input name="ctc" placeholder="CTC (LPA)" className="border p-2 rounded" onChange={handleChange} />
          <input type="date" name="drive_date" className="border p-2 rounded" onChange={handleChange} />
          <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">Add Company</button>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
