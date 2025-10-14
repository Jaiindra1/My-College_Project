import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyAnnouncementPreview() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/faculty/announcements/${id}`);
        setAnnouncement(data);
        console.log("✅ Loaded announcement preview:", data);
      } catch (err) {
        console.error("❌ Error fetching preview:", err);
      }
    })();
  }, [id]);

  const handleSend = async () => {
    if (!window.confirm("Are you sure you want to send this announcement?")) return;

    try {
      setLoading(true);
      await api.put(`/faculty/announcements/${id}`, {
        ...announcement,
        status: "Posted",
      });
      alert("✅ Announcement sent successfully!");
      navigate("/faculty/announcements");
    } catch (err) {
      console.error("❌ Error sending announcement:", err);
      alert("Failed to send announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/faculty/FacultyAnnouncementAdd/${id}`);
  };

  if (!announcement)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading announcement...
      </div>
    );

  // ✅ Default or uploaded image
  const backgroundImage =
    announcement.image_url ||
    "https://i.pinimg.com/1200x/1d/7b/87/1d7b87734a0e818d7018bda6f4fca207.jpg";

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <FacultySidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Announcement Card */}
          <div className="bg-white/70 dark:bg-black/20 rounded-xl shadow-lg border border-primary/20 overflow-hidden">
            {/* Banner */}
            <div
              className="h-64 bg-cover bg-center relative"
              style={{ backgroundImage: `url("${backgroundImage}")` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white">
                  {announcement.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.status === "Posted"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {announcement.status}
                  </span>
                  <p className="text-sm text-gray-300">
                    {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-gray-700 dark:text-gray-200">
              <h3 className="font-semibold text-primary mb-2">
                Recipients: {announcement.recipients}
              </h3>
              <p className="leading-relaxed">{announcement.content}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={() => navigate("/faculty/FacultyAnnouncementList")}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-700 transition-colors"
            >
              ✏️ Edit
            </button>

            {announcement.status !== "Posted" && (
              <button
                onClick={handleSend}
                disabled={loading}
                className={`px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                🚀 {loading ? "Sending..." : "Send"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
