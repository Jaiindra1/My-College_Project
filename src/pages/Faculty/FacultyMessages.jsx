import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyMessages() {
  const facultyId = JSON.parse(localStorage.getItem("user")).user_id; // Logged-in faculty ID
  const [form, setForm] = useState({ audience: "", message: "" });
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/faculty/faculty-messages/${facultyId}`);
      setMessages(data);
      console.log("✅ Fetched messages:", data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.audience || !form.message) {
      alert("Please select an audience and enter a message.");
      return;
    }

    try {
      await api.post("/faculty/messages", form);
      alert("✅ Message sent successfully!");
      setForm({ audience: "", message: "" });
      fetchMessages();
    } catch (err) {
      console.error("❌ Error sending message:", err);
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen flex w-full">
      {/* Sidebar */}
      <FacultySidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Messages
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Compose Message */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Compose Message
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <select
                    name="audience"
                    value={form.audience}
                    onChange={(e) =>
                      setForm({ ...form, audience: e.target.value })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg h-12 px-4 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Audience</option>
                    <option>All Students</option>
                    <option>Faculty Members</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Write your announcement here..."
                    rows="8"
                    className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg p-4 focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Recent Messages */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Messages
              </h2>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No messages yet.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-white dark:bg-slate-900/50 p-4 rounded-xl flex items-start gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${
                            msg.faculty_image ||
                            "https://via.placeholder.com/150"
                          })`,
                        }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            {msg.audience}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Sent
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {msg.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
