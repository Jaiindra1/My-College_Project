import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axiosInstance";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyMarksEntry() {
  // Logged-in faculty ID (safe parse)
  let facultyId = null;
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    facultyId = u?.user_id;
  } catch (e) {
    facultyId = null;
  }

  // Filters
  const [semesterId, setSemesterId] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [maxMarks, setMaxMarks] = useState(30); // Default max marks

  // Data states
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /** 🔹 Fetch Faculty Semesters and Subjects */
  useEffect(() => {
    const fetchFacultyFilters = async () => {
      try {
        const { data } = await api.get(`/faculty/filters/${facultyId}`);
        setSemesters(data.semesters);
        setSubjects(data.subjects);
      } catch (err) {
        console.error("❌ Error loading filters:", err);
        alert("Failed to load faculty filters.");
      }
    };
    if (facultyId) fetchFacultyFilters();
  }, [facultyId]);

  /** 🔹 Fetch Students and Marks */
  const fetchStudents = async () => {
    if (!semesterId || !subject || !examType) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/faculty/marks/${examType}`, {
        class_id: semesterId,
        subject: subject,
      });
      const normalized = data.map((s) => ({
        ...s,
        marks: s.marks == null ? "" : s.marks,
      }));
      setStudents(normalized);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      alert("Failed to load students. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Update Marks (locally) */
  const updateMarks = (studentId, value) => {
    // Prevent marks greater than maxMarks
    if (Number(value) > maxMarks) return;

    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === studentId ? { ...s, marks: value } : s
      )
    );
  };

  /** 🔹 Compute Statistics */
  const stats = useMemo(() => {
    const numeric = students
      .map((s) => Number(s.marks))
      .filter((v) => !Number.isNaN(v) && v !== "");
    if (!numeric.length) return { avg: 0, max: 0, min: 0 };
    const sum = numeric.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / numeric.length).toFixed(1),
      max: Math.max(...numeric),
      min: Math.min(...numeric),
    };
  }, [students]);

  /** 🔹 Save Marks (Draft or Publish) */
  const saveMarks = async (publish = false) => {
    if (!semesterId || !subject || !examType) {
      alert("Please select semester, subject, and exam type.");
      return;
    }

    // Validate all marks before submitting
    const invalidStudent = students.find(
      (s) => s.marks !== "" && Number(s.marks) > maxMarks
    );

    if (invalidStudent) {
      alert(
        `Error: Marks for student ${invalidStudent.name} (${invalidStudent.marks}) exceeds the maximum of ${maxMarks}. Please correct the entry before saving.`
      );
      return;
    }

    const payloadMarks = students.map((s) => ({
      student_id: s.student_id,
      marks: s.marks === "" ? null : Number(s.marks),
    }));

    setSaving(true);
    try {
      // server expects POST /save (mounted on /api/faculty/save)
      const res = await api.post("/faculty/save", {
        class_id: semesterId,
        subject: subject,
        exam_name: examType,
        max_marks: maxMarks,
        marks: payloadMarks,
        publish,
      });
      alert(res.data.message || "Marks saved successfully.");
      fetchStudents();
    } catch (err) {
      console.error("❌ Error saving marks:", err);
      alert("Failed to save marks. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex font-display bg-background-light dark:bg-background-dark min-h-screen">
      <FacultySidebar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Exam Marks Entry
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and upload exam marks for your assigned courses.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-background-light dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-black/80 dark:text-white/80 mb-4">
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Semester */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Semester
              </label>
              <select
                id="semester-select"
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className="form-select w-full bg-background-light dark:bg-background-dark border-black/20 dark:border-white/20 rounded"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.sem_id} value={sem.sem_id}>
                    {sem.sem_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Subject
              </label>
              <select
                id="subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-select w-full bg-background-light dark:bg-background-dark border-black/20 dark:border-white/20 rounded"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.subject_id} value={sub.subject_id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Exam Type
              </label>
              <select
                id="exam-type-select"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="form-select w-full bg-background-light dark:bg-background-dark border-black/20 dark:border-white/20 rounded"
              >
                <option value="">Select Exam Type</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
              </select>
            </div>

            {/* Max Marks */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Max Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="form-input w-full bg-background-light dark:bg-background-dark border-black/20 dark:border-white/20 rounded"
                min="1"
                max="100"
              />
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={fetchStudents}
                className="w-full bg-primary/10 text-primary dark:bg-primary/20 px-4 py-2 rounded-lg font-medium"
                disabled={loading || !semesterId || !subject || !examType}
              >
                {loading ? "Loading..." : "Apply"}
              </button>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-background-light dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10">
            <h3 className="text-lg font-semibold text-black/80 dark:text-white/80">
              Marks Entry Table
            </h3>
            <div className="flex items-center gap-3">
              <button className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-2 rounded-lg text-sm">
                Upload CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-black/80 dark:text-white/80">
              <thead className="text-xs text-black/60 dark:text-white/60 uppercase bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3 w-40 text-center">
                    Marks (Out of {maxMarks})
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      {loading
                        ? "Loading..."
                        : "No students loaded. Use filters and click Apply."}
                    </td>
                  </tr>
                )}

                {students.map((s) => (
                  <tr
                    key={s.student_id}
                    className="border-b hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium text-black/90 dark:text-white/90">
                      {s.name}
                    </td>
                    <td className="px-6 py-4">{s.roll_no}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        className="form-input w-24 text-center bg-background-light dark:bg-background-dark border-black/20 dark:border-white/20 rounded"
                        type="number"
                        min="0"
                        max={maxMarks}
                        value={s.marks}
                        onChange={(e) => {
                          if (Number(e.target.value) > maxMarks && e.target.value !== "") return;
                          updateMarks(s.student_id, e.target.value);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="px-6 py-4 bg-black/5 dark:bg-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-black/60 dark:text-white/60">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-black/90 dark:text-white/90 mt-1">
                  {stats.avg}
                </p>
              </div>
              <div className="p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-black/60 dark:text-white/60">
                  Highest Score
                </p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {stats.max}
                </p>
              </div>
              <div className="p-4 rounded-lg text-center">
                <p className="text-sm font-medium text-black/60 dark:text-white/60">
                  Lowest Score
                </p>
                <p className="text-2xl font-bold text-black/70 dark:text-white/70 mt-1">
                  {stats.min}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary px-6 py-2 rounded-lg font-semibold"
            onClick={() => saveMarks(false)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold"
            onClick={() => {
              if (
                !confirm("Are you sure you want to publish these marks?")
              )
                return;
              saveMarks(true);
            }}
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish Marks"}
          </button>
        </div>
      </div>
    </div>
  );
}
