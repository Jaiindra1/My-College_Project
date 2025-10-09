import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

export default function AdminTimetable() {
  const [semesterId, setSemesterId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({
    day: "",
    subject_id: "",
    faculty_id: "",
    start_time: "",
    end_time: "",
    classroom: "",
  });

  // College standard timings
  const timeSlots = [
    { start: "09:00", end: "09:50" },
    { start: "09:50", end: "10:40" },
    { start: "10:45", end: "11:35" },
    { start: "13:10", end: "14:00" },
    { start: "14:00", end: "14:45" },
    { start: "14:50", end: "15:35" },
    { start: "15:35", end: "16:20" },
  ];

  // Fetch required data on mount
  useEffect(() => {
    fetchSemesters();
    fetchSubjects();
    fetchFaculty();
  }, []);

  // ✅ Fetch all semesters
  const fetchSemesters = async () => {
    try {
      const { data } = await api.get("/semesters/");
      setSemesters(data);
    } catch (err) {
      console.error("❌ Failed to fetch semesters:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get("/subjects/");
      setSubjects(data);
    } catch (err) {
      console.error("❌ Failed to fetch subjects:", err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const { data } = await api.get("/faculty/");
      setFaculty(data);
    } catch (err) {
      console.error("❌ Failed to fetch faculty:", err);
    }
  };

  const fetchTimetable = async (semId) => {
    if (!semId) return;
    try {
      const { data } = await api.get(`/timetable/${semId}`);
      setTimetable(data);
    } catch (err) {
      console.error("❌ Failed to fetch timetable:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!semesterId) return alert("⚠️ Please select a semester first.");
    try {
      await api.post("/timetable", { semester_id: semesterId, ...form });
      alert("✅ Timetable entry added successfully");
      fetchTimetable(semesterId);
      setForm({
        day: "",
        subject_id: "",
        faculty_id: "",
        start_time: "",
        end_time: "",
        classroom: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add timetable entry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await api.delete(`/timetable/${id}`);
      fetchTimetable(semesterId);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete class");
    }
  };

  // ✅ Filter subjects only for selected semester
  const filteredSubjects = subjects.filter(
    (s) => String(s.sem_id) === String(semesterId) || s.sem === semesterId
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">📚 Manage Timetable</h1>

        {/* ✅ Select Semester (Dynamic Dropdown) */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              fetchTimetable(e.target.value);
            }}
            className="border p-2 rounded min-w-[250px]"
            required
          >
            <option value="">Select Semester</option>
            {semesters.length > 0 ? (
              semesters.map((sem) => (
                <option key={sem.sem_id} value={sem.sem_id}>
                  Semester {sem.sem}
                </option>
              ))
            ) : (
              <option disabled>Loading semesters...</option>
            )}
          </select>

          <button
            onClick={() => fetchTimetable(semesterId)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!semesterId}
          >
            Load Timetable
          </button>
        </div>

        {/* ✅ Add New Class Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow mb-8"
        >
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
              (d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              )
            )}
          </select>

          <select
            name="subject_id"
            value={form.subject_id}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Subject</option>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.name}
                </option>
              ))
            ) : (
              <option disabled>No subjects for this semester</option>
            )}
          </select>

          <select
            name="faculty_id"
            value={form.faculty_id}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Faculty</option>
            {faculty.map((f) => (
              <option key={f.faculty_id} value={f.faculty_id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Start Time</option>
            {timeSlots.map((slot, i) => (
              <option key={i} value={slot.start}>
                {slot.start}
              </option>
            ))}
          </select>

          <select
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">End Time</option>
            {timeSlots.map((slot, i) => (
              <option key={i} value={slot.end}>
                {slot.end}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="classroom"
            placeholder="Room"
            value={form.classroom}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white rounded px-4 py-2 col-span-2 md:col-span-1"
          >
            + Add
          </button>
        </form>

        {/* ✅ Timetable Table */}
        <div className="overflow-x-auto">
          <table className="w-full border bg-white dark:bg-gray-800 rounded">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-2 border">Day</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Faculty</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Classroom</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length > 0 ? (
                timetable.map((cls) => (
                  <tr
                    key={cls.timetable_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="border p-2">{cls.day}</td>
                    <td className="border p-2">{cls.subject_name}</td>
                    <td className="border p-2">{cls.faculty_name}</td>
                    <td className="border p-2">
                      {cls.start_time} - {cls.end_time}
                    </td>
                    <td className="border p-2">{cls.classroom || "-"}</td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(cls.timetable_id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-4">
                    No timetable found for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
