import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";
import { useNavigate } from "react-router-dom";

export default function FacultyAnnouncementsList() {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id; // Logged-in faculty ID
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get(`/faculty/faculty-announcements/${facultyId}`);
      setAnnouncements(data);
    } catch (err) {
      console.error("❌ Failed to load announcements:", err);
      alert("Failed to load announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <FacultySidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">Announcements</h1>
            <a
              href="/faculty/FacultyAnnouncementAdd"
              className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              New Announcement
            </a>
          </div>

          {announcements.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No announcements yet.
            </p>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/faculty/FacultyAnnouncementPreview/${a.id}`)}
                className="bg-white dark:bg-black/20 p-6 rounded-lg shadow-sm mb-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          a.status === "Sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {a.status}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                      {a.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {a.content.slice(0, 120)}...
                    </p>
                  </div>

                  {a.image_url && (
                    <img
                      src={a.image_url}
                      alt={a.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
