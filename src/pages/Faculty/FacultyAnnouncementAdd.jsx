import { useState } from "react";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyAnnouncementAdd() {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id; // Logged-in faculty ID
  const [form, setForm] = useState({
    title: "",
    content: "",
    recipients: "",
    image_url: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/faculty/faculty-announcements/${facultyId}`, form);
      alert("✅ Announcement created successfully!");
      window.location.href = "/faculty/FacultyAnnouncementList";
    } catch (err) {
      console.error("❌ Error adding announcement:", err);
      alert("Error adding announcement");
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <FacultySidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white">Announcements List</h1>
            <a
              href="/faculty/FacultyAnnouncementList"
              className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">list</span>
               Announcements
            </a>
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-8">New Announcement</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/60 dark:bg-black/20 p-6 rounded-xl border border-primary/20">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="e.g. Midterm Results"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                rows="6"
                placeholder="Write announcement details here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recipients</label>
              <select
                name="recipients"
                value={form.recipients}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="">Select Audience</option>
                <option>All Students</option>
                <option>All Faculty</option>
                <option>Computer Science Students</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Post Announcement
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
