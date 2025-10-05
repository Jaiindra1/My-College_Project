import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

export default function AssignSubjects() {
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Fetch all faculty on mount
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data } = await api.get("/faculty");
        setFaculty(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch faculty");
      }
    };
    fetchFaculty();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get("/subjects");
        setSubjects(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch subjects");
      }
    };
    fetchSubjects();
  }, []);

  // Fetch assigned subjects for selected faculty
  const fetchAssigned = async (facultyId) => {
    try {
      const { data } = await api.get(`/faculty-subjects/${facultyId}`);
      setAssigned(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch assigned subjects");
    }
  };

  const handleAssign = async () => {
    if (!selectedFaculty || !selectedSubject) {
      alert("⚠️ Please select both faculty and subject");
      return;
    }
    try {
      await api.post("/faculty-subjects/assign", {
        faculty_id: selectedFaculty,
        subject_id: selectedSubject,
      });
      alert("✅ Subject assigned successfully");
      fetchAssigned(selectedFaculty);
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to assign subject");
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await api.delete(`/faculty-subjects/${id}`);
      alert("✅ Assignment removed");
      fetchAssigned(selectedFaculty);
    } catch (err) {
      alert("❌ Failed to remove assignment");
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          📚 Assign Subjects to Faculty
        </h2>

        {/* Faculty Selection */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Faculty
          </label>
          <select
            value={selectedFaculty}
            onChange={(e) => {
              setSelectedFaculty(e.target.value);
              fetchAssigned(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">-- Select Faculty --</option>
            {faculty.map((f) => (
              <option key={f.faculty_id} value={f.faculty_id}>
                {f.name} ({f.emp_id})
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            disabled={!selectedFaculty}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          ➕ Assign
        </button>

        {/* Assigned Subjects */}
        {selectedFaculty && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">
              Assigned Subjects for Selected Faculty
            </h3>
            <table className="w-full border">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2 border">Subject Name</th>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Semester</th>
                  <th className="p-2 border text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assigned.length > 0 ? (
                  assigned.map((a) => (
                    <tr key={a.id}>
                      <td className="p-2 border">{a.subject_name}</td>
                      <td className="p-2 border">{a.code}</td>
                      <td className="p-2 border">{a.sem_id}</td>
                      <td className="p-2 border text-right">
                        <button
                          onClick={() => handleRemove(a.id)}
                          className="px-3 py-1 text-xs rounded-md bg-red-500 hover:bg-red-600 text-white"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-3 text-center text-gray-500 dark:text-gray-400"
                    >
                      No subjects assigned yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
