import { useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const SupplyResults = () => {
  const [rows, setRows] = useState([
    { student_id: "", subject_id: "", exam_id: "", marks: "" },
  ]);

  const addRow = () =>
    setRows([...rows, { student_id: "", subject_id: "", exam_id: "", marks: "" }]);

  const handleChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;
    setRows(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/results/supply", { results: rows });
      alert("Supply results uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Supply Results</h1>
        <form onSubmit={handleSubmit}>
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
              <input
                placeholder="Student ID"
                value={row.student_id}
                onChange={(e) => handleChange(idx, "student_id", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                placeholder="Subject ID"
                value={row.subject_id}
                onChange={(e) => handleChange(idx, "subject_id", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                placeholder="Exam ID"
                value={row.exam_id}
                onChange={(e) => handleChange(idx, "exam_id", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                placeholder="Marks"
                value={row.marks}
                onChange={(e) => handleChange(idx, "marks", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            + Add Row
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 ml-2 rounded"
          >
            Submit Supply Results
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplyResults;
