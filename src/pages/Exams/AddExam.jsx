import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function AddExam({ onExamAdded }) {
  const [formData, setFormData] = useState({
    regulation_id: "",
    sem_id: "",
    type: "",
    date: "",
  });

  const [regulations, setRegulations] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  // Fetch Regulations on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const { data } = await api.get("/regulations");
        setRegulations(data);
      } catch (err) {
        console.error("❌ Failed to fetch regulations:", err);
        alert("Failed to load regulations");
      }
    };
    fetchRegulations();
  }, []);

  // Fetch Semesters when a regulation is selected
  useEffect(() => {
    if (!formData.regulation_id) return;
    const fetchSemesters = async () => {
      setLoadingSemesters(true);
      try {
        console.log(
          `🔎 Fetching semesters for regulation: ${formData.regulation_id}`
        );
        const { data } = await api.get(
          `/semesters/${formData.regulation_id}`
        );
        setSemesters(data);
      } catch (err) {
        console.error("❌ Failed to fetch semesters:", err);
        alert("Failed to load semesters");
      } finally {
        setLoadingSemesters(false);
      }
    };
    fetchSemesters();
  }, [formData.regulation_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.date || !formData.sem_id) {
      alert("All fields are required!");
      return;
    }
    try {
      await api.post("/exams", formData);
      alert("✅ Exam added successfully!");
      setFormData({ regulation_id: "", sem_id: "", type: "", date: "" });
      if (onExamAdded) onExamAdded(); // Refresh exam list in parent
    } catch (err) {
      console.error("❌ Failed to add exam:", err);
      alert("Failed to add exam");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-background-dark rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        ➕ Add New Exam
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Regulation Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Regulation
          </label>
          <select
            value={formData.regulation_id}
            onChange={(e) =>
              setFormData({ ...formData, regulation_id: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Regulation</option>
            {regulations.map((reg) => (
              <option key={reg.regulation_id} value={reg.regulation_id}>
                {reg.name} ({reg.start_year}-{reg.end_year})
              </option>
            ))}
          </select>
        </div>

        {/* Semester Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Semester
          </label>
          <select
            value={formData.sem_id}
            onChange={(e) =>
              setFormData({ ...formData, sem_id: e.target.value })
            }
            disabled={!formData.regulation_id || loadingSemesters}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          >
            <option value="">
              {loadingSemesters ? "Loading..." : "Select Semester"}
            </option>
            {semesters.map((sem) => (
              <option key={sem.sem_id} value={sem.sem_id}>
                Year {sem.year} - Sem {sem.sem}
              </option>
            ))}
          </select>
        </div>

        {/* Type Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exam Type
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            placeholder="e.g. Mid1, Mid2, External"
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Exam Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          ➕ Add Exam
        </button>
      </form>
    </div>
  );
}
