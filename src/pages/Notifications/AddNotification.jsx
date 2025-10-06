import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const AddNotification = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    expires_at: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notifications", form);
      alert("✅ Notification added successfully!");
      navigate("/admin/NotificationsList");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to add notification");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">➕ Add Notification</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border rounded p-2"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            className="w-full border rounded p-2"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
          />
          <select
            name="audience"
            className="w-full border rounded p-2"
            value={form.audience}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="faculty">Faculty</option>
          </select>
          <input
            type="date"
            name="expires_at"
            className="w-full border rounded p-2"
            value={form.expires_at}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddNotification;
