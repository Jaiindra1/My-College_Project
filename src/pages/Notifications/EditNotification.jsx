import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

export default function EditNotification() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedNotification = location.state?.notification;

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
    expires_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null); // ✅ store result message

  useEffect(() => {
    if (passedNotification) {
      setForm({
        title: passedNotification.title,
        message: passedNotification.message,
        audience: passedNotification.audience,
        expires_at: passedNotification.expires_at,
      });
      setLoading(false);
    } else {
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
      navigate("/admin/notificationsList");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update notification.");
    }
  };

  // ✅ Send Notification Button handler
  const handleSendNotification = async () => {
    if (!window.confirm("Send this notification now?")) return;
    setSending(true);
    setSendResult(null);

    try {
      const { data } = await api.post(`/notifications/${id}/send`);
      setSendResult({ success: true, message: data.message });
    } catch (err) {
      console.error("❌ Send error:", err);
      setSendResult({
        success: false,
        message: err.response?.data?.error || "Failed to send notification.",
      });
    } finally {
      setSending(false);
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

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>

            {/* ✅ Send Button */}
            <button
              type="button"
              onClick={handleSendNotification}
              disabled={sending}
              className={`flex-1 py-2 rounded text-white ${
                sending
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {sending ? "Sending..." : "📨 Send Notification"}
            </button>
          </div>

          {/* ✅ Show send result */}
          {sendResult && (
            <p
              className={`mt-3 text-sm font-medium ${
                sendResult.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {sendResult.message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
