import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

export default function EditNotification() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get notification data if passed from list
  const passedNotification = location.state?.notification;

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    expires_at: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (passedNotification) {
      // If we have notification from state, use it directly
      setForm({
        title: passedNotification.title,
        message: passedNotification.message,
        audience: passedNotification.audience,
        expires_at: passedNotification.expires_at,
      });
      setLoading(false);
    } else {
      // Otherwise fetch from API
      const fetchNotification = async () => {
        try {
          const { data } = await api.get(`/notifications/${id}`);
          setForm(data);
        } catch (err) {
          console.error("❌ Error fetching notification:", err);
          alert("Failed to load notification.");
        } finally {
          setLoading(false);
        }
      };
      fetchNotification();
    }
  }, [id, passedNotification]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notifications/${id}`, form);
      alert("✅ Notification updated successfully!");
      navigate("/admin/notifications-list");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update notification.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">✏️ Edit Notification</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-lg bg-white p-6 rounded shadow"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
            rows={4}
            className="w-full border p-2 rounded"
          />
          <select
            name="audience"
            value={form.audience}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="faculty">Faculty</option>
          </select>
          <input
            type="date"
            name="expires_at"
            value={form.expires_at ? form.expires_at.split("T")[0] : ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
