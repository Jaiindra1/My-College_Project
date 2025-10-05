import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/axiosInstance";

const UploadAttendance = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/attendance/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Attendance uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Attendance (Excel)</h1>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadAttendance;
