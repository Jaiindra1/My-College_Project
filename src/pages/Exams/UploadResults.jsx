import { useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/Sidebar";

const UploadResults = () => {
  const [form, setForm] = useState({
    exam_id: "",
    student_id: "",
    subject_id: "",
    marks: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/exams/result", form);
      alert("Result uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Results</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="exam_id"
            placeholder="Exam ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="student_id"
            placeholder="Student ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="subject_id"
            placeholder="Subject ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="marks"
            placeholder="Marks"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded"
          >
            Submit Result
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResults;
