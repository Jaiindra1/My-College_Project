import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";
import AddExam from "./AddExam"; // Add Exam Form Component

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);
  const [formData, setFormData] = useState({ type: "", date: "" });
  const [showAddModal, setShowAddModal] = useState(false); // Modal visibility

  // Fetch Exams
  const fetchExams = async () => {
    try {
      const { data } = await api.get("/exams");
      setExams(data);
    } catch (err) {
      console.error("❌ Error fetching exams:", err);
      alert("Failed to fetch exams");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await api.delete(`/exams/${id}`);
      fetchExams();
      alert("Exam deleted successfully ✅");
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  const handleEditClick = (exam) => {
    setEditExam(exam.exam_id);
    setFormData({
      type: exam.type,
      date: exam.date.split("T")[0],
    });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/exams/${editExam}`, formData);
      setEditExam(null);
      fetchExams();
      alert("✅ Exam updated successfully");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            📝 Exams
          </h2>

          {/* Add Exam Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg 
                     bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm
                     shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-lg 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Exam
          </button>
        </header>

        {/* Exam Table */}
        <div className="bg-white dark:bg-background-dark/50 rounded-xl shadow-lg">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm text-left text-black-700 dark:text-gray-300">
              <thead className="text-xs uppercase font-semibold tracking-wide bg-red-100 dark:bg-red-300 text-gray-600 dark:text-black">
                <tr>
                  <th className="px-6 py-4">Regulation</th>
                  <th className="px-6 py-4">Semester</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length ? (
                  exams.map((exam) => (
                    <tr
                      key={exam.exam_id}
                      className="border-b hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <td className="px-6 py-4">{exam.regulation_name}</td>
                      <td className="px-6 py-4">Sem {exam.semester}</td>

                      {editExam === exam.exam_id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={formData.type}
                              onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value })
                              }
                              className="border rounded px-2 py-1 w-24"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={formData.date}
                              onChange={(e) =>
                                setFormData({ ...formData, date: e.target.value })
                              }
                              className="border rounded px-2 py-1"
                            />
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={handleUpdate}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-green-500 hover:bg-green-600 text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditExam(null)}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-gray-400 hover:bg-gray-500 text-white"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">{exam.type}</td>
                          <td className="px-6 py-4">
                            {new Date(exam.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(exam)}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(exam.exam_id)}
                              className="px-3 py-1 text-xs font-medium rounded-md bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No exams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add Exam */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white dark:bg-background-dark rounded-lg shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <AddExam
                onClose={() => {
                  setShowAddModal(false);
                  fetchExams();
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
