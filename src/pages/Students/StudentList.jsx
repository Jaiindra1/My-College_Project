import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    email: "",
    join_year: "",
    regulation_id: "",
  });

  // ✅ Fetch students
  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students/");
      console.log(data);
      setStudents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };

  // ✅ Fetch regulations
  const fetchRegulations = async () => {
    try {
      const { data } = await api.get("/regulations");
      setRegulations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch regulations");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchRegulations();
  }, []);

  // ✅ Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ Open modal with selected student's data
  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.student_name,
      roll_no: student.roll_no,
      email: student.email || "",
      join_year: student.join_year || "",
      regulation_id: student.regulation_id || "1",
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save changes
  const saveChanges = async () => {
    try {
      await api.put(`/students/${editingStudent.student_id}`, formData);
      alert("✅ Student updated successfully!");
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            🎓 Students
          </h2>
          <Link
            to="/students/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition duration-300"
          >
            ➕ Add Student
          </Link>
        </header>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark/60 rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-blue-100 dark:bg-blue-900 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Roll No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Join Year</th>
                <th className="px-6 py-4">Regulation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr
                    key={s.student_id}
                    className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-800 dark:text-black">{s.roll_no}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-black">{s.student_name}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-black">{s.email || "—"}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-black">{s.join_year || "—"}</td>
                    <td className="px-6 py-3 text-gray-800 dark:text-black">{s.regulation || "—"}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-4 py-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStudent(s.student_id)}
                        className="px-4 py-2 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                ✏️ Edit Student
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Full Name"
                />

                {/* Roll No */}
                <input
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Roll Number"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Email Address"
                />

                {/* Join Year */}
                <select
                  name="join_year"
                  value={formData.join_year}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Join Year</option>
                  {Array.from(
                    { length: new Date().getFullYear() - 2000 + 1 }, // from 2000 to current year
                    (_, i) => 2000 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Regulation */}
                <select
                  name="regulation_id"
                  value={formData.regulation_id}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Regulation</option>
                  {regulations.map((r) => (
                    <option key={r.regulation_id} value={r.regulation_id}>
                      {r.name} ({r.start_year}-{r.end_year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentList;
