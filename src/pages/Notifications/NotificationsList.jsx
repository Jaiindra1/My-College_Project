import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/notifications");

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        console.warn("⚠️ Expected array but got:", data);
        setNotifications([]);
      }
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
      setError("❌ Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      await api.delete(`/notifications/${id}`);
      alert("✅ Notification deleted successfully");
      fetchNotifications();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert(err.response?.data?.error || "❌ Failed to delete notification.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">📢 Notifications</h1>
          <Link
            to="/admin/Notifications/Add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add Notification
          </Link>
        </div>

        {loading && <p>Loading notifications...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border rounded text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Audience</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center ">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <tr key={n.notification_id} className="hover:bg-gray-50">
                    <td className="border p-2">{n.title}</td>
                    <td className="border p-2">{n.message}</td>
                    <td className="border p-2 capitalize">{n.audience}</td>
                    <td className="border p-2">
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td className="border p-2 space-x-2">
                    <Link
                        to={`/admin/notifications-edit/${n.notification_id}`}
                        state={{ notification: n }}   // 👈 Pass full notification data
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(n.notification_id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No notifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
